import { IconButton,Button, TextField, Divider } from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db } from "../firebase";
import L1 from '../assets/L1.jpg'
import L2 from '../assets/L4.jpg'
import L3 from '../assets/L3.jpg'
import L4 from '../assets/L2.jpg'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { collection, query, where, getDocs ,addDoc, updateDoc, doc,getDoc, DocumentSnapshot ,onSnapshot} from "firebase/firestore"; 
import "./Class.css";
function Class() {
  const [classData, setClassData] = useState({});
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [showInput, setShowInput] = useState(false);
  const [image, setImage] = useState(null);
  const [people,setPeople]=useState(false);
  const [students,setStudents]=useState([]);
  const [classimg,setClassImg]=useState();
  const mypic=[L1,L2,L3,L4];
  const randomImage = mypic[Math.floor(Math.random() * mypic.length)];
  // setClassImg(randomImage);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const storage = getStorage();
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg'
  };
  const handlechange=()=>{
    setPeople(true)
  }
  const handleClass=()=>{
    setPeople(false)
  }
  const handleUpload = () => {

    // Upload file and metadata to the object 'images/mountains.jpg'
    if(image){
    const storageRef = ref(storage, 'images/' + image.name);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        setShowInput(false)
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          createPost(downloadURL)
        });
      }
    );
    }else createPost('')

  };
  const { id } = useParams();
  console.log("class",id)
    const navigate=useNavigate();
  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);
  useEffect(() => {
    // reverse the array
    let Array = classData?.enrolledStudent;
    setStudents(Array);
    console.log(students);
  }, [classData]);


  const createPost = async (url) => {
    try {
      const myClassRef =  await getDoc(doc(db,"classes",id))
      console.log(id)
    if (!myClassRef.exists) {
        return alert(`Class doesn't exist, please provide correct ID`);
      }
      else {
          console.log("class exist")
      }
      const myClassData = await myClassRef.data();
      console.log(myClassData);
      let tempPosts = myClassData.posts;
      
      const newPost=await addDoc(collection(db,"posts"),{
        authorId: user.uid,
        content: announcementContent,
        date: moment().format("MMM Do YY"),
        image: user.photoURL,
        name: user.displayName,
        img: url,
        comments:[],
      }); 

      

      tempPosts.push({
        id: newPost.id,
        authorId: user.uid,
        date: moment().format("MMM Do YY"),
      });
      const docRef=await updateDoc( doc(db,"classes",id),{
        posts: tempPosts,
    })
    setAnnouncementContent("")
    setShowInput(false)
    } catch (error) {
      setShowInput(false)
      console.error(error);
      alert(`There was an error posting the announcement, please try again!`);
    }
  };
  useEffect(() => {
    const q=query(doc(db,"classes",id))
    onSnapshot(q, (snapshot) => {
        const data = snapshot.data();
        if (!data) navigate(-1);
        console.log(data);
        setClassData(data);
        setClassImg(randomImage);
      });
  }, [id]);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/');
  }, [loading, user]);

  console.log(students);
  return (
    <div>
    <nav className="navbar_small" >
    <div className="mid_small" > 
    <ul className="navbar_mid_small">
      <li onClick={handleClass}><a className={!people&& "active"}>Class</a></li>
      <li onClick={handlechange}><a className={people&& "active"} >People</a></li>
    </ul>
    </div>
    </nav>
    <div className="class">
      <div className="class__nameBox">
        <img src={classimg} className="nameboximage"/>
        <div className="class__name">{classData?.name}</div>
        {classData?.creatorUid==user?.uid&&<div className="class_id">Classid- {id}</div> }
      </div>
      {!people&&<div className="class__announce">
      {showInput ? (
                  <div className="main__form">
                    <TextField
                      id="filled-multiline-flexible"
                      multiline
                      label="Announce Something to class"
                      variant="filled"
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                    />
                    <div className="main__buttons">
                      <input
                        onChange={handleChange}
                        variant="outlined"
                        color="primary"
                        type="file"
                      />

                      <div>
                        <Button onClick={() => setShowInput(false)}>
                          Cancel
                        </Button>

                        <IconButton onClick={handleUpload}>
                            <SendOutlined />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="main__wrapper100"
                    onClick={() => setShowInput(true)}
                  >
                    <div className="announcement__imageContainer">
                    <img src={user?.photoURL} alt="My image" />
                    </div>
                    <div>Announce Something to class</div>
                  </div>
                )}


        
      </div>}
      {!people&&posts?.map((post) => (
        <Announcement
          id={post.id}
        />
      ))}
      { people && <div>
        <div>
        <h1 style={{color:'#088178'}}>Teacher</h1>
        <Divider/>
        <div className="main__wrapper100">
          <div className="announcement__imageContainer">
            <img src={classData?.creatorPhoto} alt="My image" />
          </div>
          <div>{classData?.creatorName}</div>
      </div>
    </div>
    <div>
      <h1 style={{color:'#088178'}}>Enrolled Students</h1>
      {students?.map((student) => (
        <div>
        <Divider/>
        <div className="main__wrapper100">
          <div className="announcement__imageContainer">
            <img src={student?.image} alt="My image" />
          </div>
          <div>{student?.name}</div>
      </div></div>
      )
      )}
    </div> </div>}
    </div></div>
  );
}

export default Class;