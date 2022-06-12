import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
  } from "@material-ui/core";
  import React, { useState } from "react";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { useRecoilState } from "recoil";
  import { auth, db } from "../firebase";
  import { collection, query, where, getDocs ,addDoc, updateDoc, doc } from "firebase/firestore"; 
  import { createDialogAtom } from "../utils/atom";
  function CreateClass() {
    const [user, loading, error] = useAuthState(auth);
    const [open, setOpen] = useRecoilState(createDialogAtom);
    const [className, setClassName] = useState("");
    const [success,setSuccess]=useState(false);
    const [classid,setClassid]=useState("");
    const handleClose = () => {
      setSuccess(false);
      setOpen(false);
    };
    const createClass = async () => {
      try {
        const newClass=await addDoc(collection(db,"classes"),{
            creatorUid: user.uid,
            name: className,
            creatorName: user.displayName,
            creatorPhoto: user.photoURL,
            posts: [],
          });  
        // add to current user's class list
        const q=query(collection(db,"users"),where("uid","==",user.uid))
        const userRef=await getDocs(q);
        console.log(userRef)
        const docId = userRef.docs[0].id;
        console.log("docId",docId)
        const userData = userRef.docs[0].data();
        console.log("userData",userData)
        let userClasses = userData.enrolledClassrooms;
        userClasses.push({
          id: newClass.id,
          name: className,
          creatorName: user.displayName,
          creatorPhoto: user.photoURL,
          creatorUid: user.uid,
        });

        const docRef=await updateDoc( doc(db,"users",docId),{
            enrolledClassrooms: userClasses,
        })
        setSuccess(true);
        setClassid(newClass.id);
        console.log('success-',success);
      } catch (err) {
        alert(`Cannot create class - ${err.message}`);
      }
    };
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{!success?"Create class":"Classroom created successfully!"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {!success?"Enter the name of class and we will create a classroom for you!":classid + "Share this id to invite others" }
            </DialogContentText>
            {!success&&<TextField
              autoFocus
              margin="dense"
              label="Class Name"
              type="text"
              fullWidth
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />}
          </DialogContent>
          <DialogActions>
            {!success && <Button onClick={handleClose} color="primary">
              Cancel
            </Button>}
            {!success&&<Button onClick={createClass} color="primary">
              Create
            </Button>}
            {success && <Button onClick={handleClose} color="primary">
              Ok
            </Button>}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  export default CreateClass;