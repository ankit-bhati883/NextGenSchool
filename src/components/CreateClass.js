import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
  } from "@material-ui/core";
  import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
  import { TailSpin } from  'react-loader-spinner'
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
    const [loader,setLoader]=useState(false);
    const handleClose = () => {
      setSuccess(false);
      setOpen(false);
    };
    const createClass = async () => {
      setLoader(true);
      try {
        const newClass=await addDoc(collection(db,"classes"),{
            creatorUid: user.uid,
            name: className,
            creatorName: user.displayName,
            creatorPhoto: user.photoURL,
            posts: [],
            enrolledStudent:[],
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
        setLoader(false);
      } catch (err) {
        setLoader(false);
        alert(`Cannot create class - ${err.message}`);
      }
    };
    return (
      <div >
        	
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          style={{minwidth:'400px'}}
        >
          {!success&&<DialogTitle id="form-dialog-title">Create class</DialogTitle>}
          {success&&<DialogTitle id="form-dialog-title">Classroom created successfully!</DialogTitle>}
          {/* <DialogTitle id="form-dialog-title">{!success?"Create class":"Classroom created successfully!"}</DialogTitle> */}
          <DialogContent>
            {loader&&	<TailSpin color="#00BFFF" height={100} width={100} />}
            {!loader&&<DialogContentText>
              {!success?"Enter the name of class and we will create a classroom for you!":classid + "Share this id to invite others" }
            </DialogContentText>}
            {!loader&&!success&&<TextField
              autoFocus
              margin="dense"
              label="Class Name"
              type="text"
              fullWidth
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />}
          </DialogContent>
          {!loader&&<DialogActions>
            {!success && <Button onClick={handleClose} color="primary">
              Cancel
            </Button>}
            {!success&&<Button onClick={createClass} color="primary">
              Create
            </Button>}
            {success && <Button onClick={handleClose} color="primary">
              Ok
            </Button>}
          </DialogActions>}
        </Dialog>
      </div>
    );
  }
  export default CreateClass;