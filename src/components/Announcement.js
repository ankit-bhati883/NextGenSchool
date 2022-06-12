import { IconButton } from "@material-ui/core";
import {  MoreVert } from "@material-ui/icons";
import moment from "moment";
import React, { useState } from "react";
import Divider from '@mui/material/Divider';
import { SendOutlined } from "@material-ui/icons";
import "./Announcement.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import {  query, updateDoc, doc,getDoc,onSnapshot} from "firebase/firestore"; 
import Comment from "../components/Comment";

function Announcement({ id,image, name, date, content, authorId , img }) {
  const [user, loading, error] = useAuthState(auth);
  const [postdata,setPostData]=useState({});
  const [comments,setComments]=useState([]);
  const [newcomment,setNewComment]=useState("");
  useEffect(() => {
    const q=query(doc(db,"posts",id))
    onSnapshot(q, (snapshot) => {
        const data = snapshot.data();
        if(data) {console.log(data);
        setPostData(data);}
      });
  }, [id]);
  useEffect(() => {
    let Array = postdata?.comments;
    setComments(Array);
    console.log(comments)
  }, [postdata]);

  const handleaddcomment = async () => {
    try {
      const myPostRef =  await getDoc(doc(db,"posts",id))
      console.log(id)
    if (!myPostRef.exists) {
        return alert(`Post doesn't exist, please provide correct ID`);
      }
      else {
          console.log("Post exist")
      }
      const myPostData = await myPostRef.data();
      console.log(myPostData);
      let tempComments = myPostData.comments;
      

      

      tempComments.push({
        authorId: user.uid,
        content: newcomment,
        date: moment().format("MMM Do YY"),
        image: user.photoURL,
        name: user.displayName,
      });
      const docRef=await updateDoc( doc(db,"posts",id),{
        comments: tempComments,
    })
    setNewComment("")
    } catch (error) {
      console.error(error);
      alert(`There was an error posting the announcement, please try again!`);
    }
  };

  return (
    <div className="announcement_box">
      
    <div className="announcement">
      <div className="announcement__informationContainer">
        <div className="announcement__infoSection">
          <div className="announcement__imageContainer">
            <img src={postdata?.image} alt="Profile photo" />
          </div>
          <div className="announcement__nameAndDate">
            <div className="announcement__name">{postdata?.name}</div>
            <div className="announcement__date">{postdata?.date}</div>
          </div>
        </div>
        <div className="announcement__infoSection">
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="announcement__content">{postdata?.content}</div>
      <div className="imgcont">{postdata?.img && <img className="amt__img" src={postdata?.img} alt={content} />}</div>
      
    </div>
    <Divider/>
    {comments?.map((comment) => (
        <Comment
          authorId={comment.authorId}
          content={comment.content}
          date={comment.date}
          image={comment.image}
          name={comment.name}
        />
      ))}
    
    

      <Divider/>
    <div
        className="Add_comments"
        >
          <img src={user?.photoURL} alt="My image" />
        <input
          type="text"
          value={newcomment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <IconButton   onClick={handleaddcomment}>
          <SendOutlined  />
        </IconButton>
        
      </div>
    </div>
  );
}
export default Announcement;