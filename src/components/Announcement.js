import { IconButton } from "@material-ui/core";
import { Menu, MoreVert } from "@material-ui/icons";
import React from "react";
import {  TextField } from "@material-ui/core";
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import { SendOutlined } from "@material-ui/icons";
import "./Announcement.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
function Announcement({ image, name, date, content, authorId , img }) {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div className="announcement_box">
      
    <div className="announcement">
      <div className="announcement__informationContainer">
        <div className="announcement__infoSection">
          <div className="announcement__imageContainer">
            <img src={image} alt="Profile photo" />
          </div>
          <div className="announcement__nameAndDate">
            <div className="announcement__name">{name}</div>
            <div className="announcement__date">{date}</div>
          </div>
        </div>
        <div className="announcement__infoSection">
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="announcement__content">{content}</div>
      <div className="imgcont">{img && <img className="amt__img" src={img} alt={content} />}</div>
      
    </div>
    <Divider/>
    <div
        className="Add_comments"
        >
          <img src={user?.photoURL} alt="My image" />
        <input
          type="text"
          // value={announcementContent}
          // onChange={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Add a comment"
        />
        <IconButton >
          <SendOutlined />
        </IconButton>
        {/* <div className="announcement__imageContainer">
          <img src={user?.photoURL} alt="My image" />
        </div>
        <div>
        <InputBase
        fullWidth
        sx={{ ml: 1, flex: 1 }}
        placeholder="Add a Comment"
        className="inputcomment"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
        <input type="text" placeholder="Add a comment" className="comment_input"></input>
        <IconButton >
          <SendOutlined />
        </IconButton>            
        </div> */}
      </div>
    </div>
  );
}
export default Announcement;