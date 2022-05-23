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
  import { auth, logout } from "../firebase";
  import { collection, query, where, getDocs ,addDoc, updateDoc, doc,getDoc, DocumentSnapshot } from "firebase/firestore"; 
  import { signoutAtom } from "../utils/atom";
  import { useNavigate } from 'react-router-dom';
  function SignoutComp() {
    const navigate = useNavigate();
    const [open, setOpen] = useRecoilState(signoutAtom);
    const [user, loading, error] = useAuthState(auth);
    // const [classId, setClassId] = useState("");
    const handleClose = () => {
      setOpen(false);
    };
    const handlelogout=()=>{
        logout()
        handleClose()
        // navigate(`/`);
    }
    // const joinClass = async () => {
    //   try {
    //     // check if class exists
    //     console.log("class start")
    //     const classRef=await getDoc(doc(db,"classes",classId))
    //     // const classRef = await db.collection("classes").doc(classId).get();
    //     if (!classRef.exists) {
    //       return alert(`Class doesn't exist, please provide correct ID`);
    //     }
    //     else {
    //         console.log("class exist")
    //     }
    //     const classData = await classRef.data();
    //     console.log("classData",classData)
    //     // add class to user
    //     console.log(user.uid)
    //     const q=query(collection(db,"users"),where("uid","==",user.uid))
    //     const userRef=await getDocs(q);
    //     // const userRef= await getDoc(collection(db,"users"),where("uid","==",user.uid))
    //     console.log(userRef)
    //     // const userRef = await db.collection("users").where("uid", "==", user.uid);
    //     const userData = await userRef.docs[0].data();
    //     console.log("userData",userData)
    //     // const userData = await (await userRef.get()).docs[0].data();
    //     let tempClassrooms = userData.enrolledClassrooms;
    //     tempClassrooms.push({
    //       creatorName: classData.creatorName,
    //       creatorPhoto: classData.creatorPhoto,
    //       id: classId,
    //       name: classData.name,
    //     });
    //     const docId = userRef.docs[0].id;
    //     console.log("docId",docId)
    //     const docRef=await updateDoc( doc(db,"users",docId),{
    //         enrolledClassrooms: tempClassrooms,
    //     })
    //     // await (
    //     //   await userRef.get()
    //     // ).docs[0].ref.update({
    //     //   enrolledClassrooms: tempClassrooms,
    //     // });

    //     // alert done
    //     alert(`Enrolled in ${classData.name} successfully!`);
    //     handleClose();
    //   } catch (err) {
    //     console.error(err);
    //     alert(err.message);
    //   }
    // };
    return (
      <div className="joinClass">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Do You Want to SignOut</DialogTitle>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handlelogout
            } color="primary">
              SignOut
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  export default SignoutComp;