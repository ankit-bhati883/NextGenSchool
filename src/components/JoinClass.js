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
  import { collection, query, where, getDocs ,addDoc, updateDoc, doc,getDoc, DocumentSnapshot } from "firebase/firestore"; 
  import { joinDialogAtom } from "../utils/atom";
  function JoinClass() {
    const [open, setOpen] = useRecoilState(joinDialogAtom);
    const [user, loading, error] = useAuthState(auth);
    const [classId, setClassId] = useState("");
    const [classname, setClassname]=useState("");
    const [success,setSuccess]=useState(false);
    const handleClose = () => {
      setSuccess(false);
      setOpen(false);
    };
    const joinClass = async () => {
      try {
        // check if class exists
        console.log("class start")
        const classRef=await getDoc(doc(db,"classes",classId))
        if (!classRef.exists) {
          return alert(`Class doesn't exist, please provide correct ID`);
        }
        else {
            console.log("class exist")
        }
        const classData = await classRef.data();
        console.log("classData",classData)
        // add class to user
        console.log(user.uid)
        const q=query(collection(db,"users"),where("uid","==",user.uid))
        const userRef=await getDocs(q);
        console.log(userRef)
        const userData = await userRef.docs[0].data();
        console.log("userData",userData)
        let tempClassrooms = userData.enrolledClassrooms;
        tempClassrooms.push({
          creatorName: classData.creatorName,
          creatorPhoto: classData.creatorPhoto,
          id: classId,
          name: classData.name,
        });
        const docId = userRef.docs[0].id;
        console.log("docId",docId)
        const docRef=await updateDoc( doc(db,"users",docId),{
            enrolledClassrooms: tempClassrooms,
        })
        // alert done
        setSuccess(true);
        setClassname(classData.name);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
    return (
      <div className="joinClass">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Join class</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {!success?"Enter ID of the class to join the classroom":`Enrolled in ${classname} successfully!`}
            </DialogContentText>
            {!success&&<TextField
              autoFocus
              margin="dense"
              label="Class Id"
              type="text"
              fullWidth
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            />}
          </DialogContent>
          <DialogActions>
            {!success&&<Button onClick={handleClose} color="primary">
              Cancel
            </Button>}
            {!success&&<Button onClick={joinClass} color="primary">
              Join
            </Button>}
            {success&&<Button onClick={handleClose} color="primary">
              Ok
            </Button>}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  export default JoinClass;