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
    const handleClose = () => {
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
        // const newClass = await db.collection("classes").add({
        //   creatorUid: user.uid,
        //   name: className,
        //   creatorName: user.displayName,
        //   creatorPhoto: user.photoURL,
        //   posts: [],
        // });
        // const q=query(collection(db,"users"),where("uid","==",user.uid))
        // add to current user's class list
        const q=query(collection(db,"users"),where("uid","==",user.uid))
        const userRef=await getDocs(q);
        console.log(userRef)
        // const userRef = await db
        //   .collection("users")
        //   .where("uid", "==", user.uid)
        //   .get();
        // const docId = userRef.id;
        // console.log("docId",docId)
        // const userData = userRef.data();
        // console.log("userData",userData)
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
        });

        const docRef=await updateDoc( doc(db,"users",docId),{
            enrolledClassrooms: userClasses,
        })
        // const docRef = await db.collection("users").doc(docId);
        // await docRef.update({
        //   enrolledClassrooms: userClasses,
        // });
        handleClose();
        alert("Classroom created successfully!");
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
          <DialogTitle id="form-dialog-title">Create class</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the name of class and we will create a classroom for you!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Class Name"
              type="text"
              fullWidth
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={createClass} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  export default CreateClass;