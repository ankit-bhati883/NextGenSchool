import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Menu as MenuIcon} from "@material-ui/icons"
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs ,addDoc, updateDoc, doc,getDoc, DocumentSnapshot ,onSnapshot} from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, IconButton } from '@material-ui/core';



export default function TemporaryDrawer() {
  const [user, loading, error] = useAuthState(auth);
  const [classes, setClasses] = useState([]);
  const [state, setState] = React.useState({

    left: false,
  });
  
  const fetchClasses = async () => {
    try {
        const q=query(collection(db,"users"),where("uid", "==", user.uid))
        onSnapshot(q, (snapshot) => {
            setClasses(snapshot?.docs[0]?.data()?.enrolledClassrooms);
          });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchClasses();
  }, [user, loading]);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const Navigate=useNavigate()
  const handlehome =()=>{
    Navigate('/dashboard')
  }
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Classes'].map((text, index) => (
          <ListItem key={text} disablePadding onClick={handlehome}>
            <ListItemButton>
              <ListItemIcon>
                 <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <div>Enrolled</div>
      <List>
        {
        
        classes.map((object) => (
          <ListItem key={object.name} disablePadding onClick={() => {
            console.log(object.id)
            Navigate(`/class/${object.id}`);
            console.log(object.id)
          }} >
            <ListItemButton>
              <ListItemIcon>
                <IconButton >
                  <Avatar src={object.creatorPhoto} />
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={object.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} style={{margin:-4}}><MenuIcon /></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
