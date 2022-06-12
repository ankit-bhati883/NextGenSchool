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
    const handleClose = () => {
      setOpen(false);
    };
    const handlelogout=()=>{
        logout()
        handleClose()
    }
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