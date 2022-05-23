import { IconButton,Button, TextField } from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db } from "../firebase";
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
  const handleUpload = () => {

    
    
    // Create the file metadata
    
    
    // Upload file and metadata to the object 'images/mountains.jpg'
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
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
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



    // const uploadImage = storage.ref(`images/${image.name}`).put(image);

    // uploadImage.on("state_changed", () => {
    //   storage
    //     .ref("images")
    //     .child(image.name)
    //     .getDownloadURL()
    //     .then((url) => {
    //       createPost(url)
    //       // db.collection("announcments")
    //       //   .doc("classes")
    //       //   .collection(classData.id)
    //       //   .add({
    //       //     timstamp: firebase.firestore.FieldValue.serverTimestamp(),
    //       //     imageUrl: url,
    //       //     text: inputValue,
    //       //     sender: loggedInMail,
    //       //   });
    //     });
    // });
  };
  const { id } = useParams();
  // window.location.reload() 
  console.log("class",id)
//   const history = useHistory();
    const navigate=useNavigate()
  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);
  const createPost = async (url) => {
    try {
      const myClassRef =  await getDoc(doc(db,"classes",id))
      console.log(id)
    //   const myClassRef = await db.collection("classes").doc(id).get();
    // const myClassData =await myClassRef.data
    if (!myClassRef.exists) {
        return alert(`Class doesn't exist, please provide correct ID`);
      }
      else {
          console.log("class exist")
      }
      const myClassData = await myClassRef.data();
      console.log(myClassData);
      let tempPosts = myClassData.posts;
      tempPosts.push({
        authorId: user.uid,
        content: announcementContent,
        date: moment().format("MMM Do YY"),
        image: user.photoURL,
        name: user.displayName,
        img: url,
      });
      const docRef=await updateDoc( doc(db,"classes",id),{
        posts: tempPosts,
    })
    setAnnouncementContent("")
    setShowInput(false)
    //   myClassRef.ref.update({
    //     posts: tempPosts,
    //   });
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
      });
    // db.collection("classes")
    //   .doc(id)
    //   .onSnapshot((snapshot) => {
    //     const data = snapshot.data();
    //     if (!data) history.replace("/");
    //     console.log(data);
    //     setClassData(data);
    //   });
  }, [id]);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/');
  }, [loading, user]);
  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">{classData?.name}</div>
      </div>
      <div className="class__announce">
      {showInput ? (
                  <div className="main__form">
                    <TextField
                      id="filled-multiline-flexible"
                      multiline
                      label="Announce Something to class"
                      variant="filled"
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      // value={inputValue}
                      // onChange={(e) => setInput(e.target.value)}
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
                    <img src={user?.photoURL} alt="My image" />
                    <div>Announce Something to class</div>
                  </div>
                )}


        
        {/* <input
          type="text"
          value={announcementContent}
          onChange={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Announce something to your class"
        />
        <IconButton onClick={createPost}>
          <SendOutlined />
        </IconButton> */}
      </div>
      {posts?.map((post) => (
        <Announcement
          authorId={post.authorId}
          content={post.content}
          date={post.date}
          image={post.image}
          name={post.name}
          img={post.img}
        />
      ))}
    </div>
  );
}
export default Class;