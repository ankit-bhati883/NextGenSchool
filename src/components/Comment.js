import { IconButton } from "@material-ui/core";
import {  MoreVert } from "@material-ui/icons";
import React from "react";
import "./Comment.css";


function Comment({ authorId,content,date,image,name }) {
  return (
   
    <div className="comment">
      <div className="comment__informationContainer">
        <div className="comment__infoSection">
          <div className="comment__imageContainer">
            <img src={image} alt="Profile photo" />
          </div>
          <div className="comment_nameDateContent">
          <div className="comment__nameAndDate">
            <div className="comment__name">{name}</div>
            <div className="comment__date">{date}</div>
          </div>
          <div className="comment__content">{content}</div>
          </div>
        </div>
        <div className="comment__infoSection">
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      </div>
  );
}
export default Comment;