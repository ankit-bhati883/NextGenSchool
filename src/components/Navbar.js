import { Avatar, IconButton, MenuItem, Menu } from "@material-ui/core";
import { Add, Apps, Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth, logout } from "../firebase";
import { createDialogAtom, joinDialogAtom, signoutAtom, createSuccessDialogAtom, joinSuccessDialogAtom } from "../utils/atom";
import CreateClass from "./CreateClass";
import JoinClass from "./JoinClass";
import SignoutComp from "./SignoutComp";
import "./Navbar.css";
import N from '../assets/n.png'
import  TemporaryDrawer  from "./Drawer";
function Navbar({add}) {
  
  const [user, loading, error] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createOpened, setCreateOpened] = useRecoilState(createDialogAtom);
  const [joinOpened, setJoinOpened] = useRecoilState(joinDialogAtom);
  const [signoutOpened, setsignoutOpened] = useRecoilState(signoutAtom);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(add)
  return (
    <>
      <CreateClass />
      <JoinClass />
      <SignoutComp/>

      <nav className="navbar">
        <div className="navbar__left">
          <IconButton style={{padding:4}}>
            <TemporaryDrawer/>
          </IconButton>
          <img
            src={N}
            alt="Google Logo"
            className="navbar__logo"
          />{" "}
          <span>EXTGenSchool</span>
        </div>
        <div className="navbar__right">
           {add==true?
          (<IconButton
            style={{padding:4}}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Add />
          </IconButton>) : null }
          <IconButton>
            <Apps />
          </IconButton>
          <IconButton onClick={() => {
                setsignoutOpened(true);
                handleClose();
              }} style={{padding:4}}>
            <Avatar src={user?.photoURL} className="userimg"/>
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                setCreateOpened(true);
                handleClose();
              }}
            >
              Create Class
            </MenuItem>
            <MenuItem
              onClick={() => {
                setJoinOpened(true);
                handleClose();
              }}
            >
              Join Class
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
}
export default Navbar;




