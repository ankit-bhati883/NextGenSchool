import React, { useEffect } from "react";
import "./Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import ClassCard from "../components/ClassCard";
import Navbar from "../components/Navbar";
import { collection, query, where, getDocs ,addDoc, updateDoc, doc,getDoc, DocumentSnapshot ,onSnapshot} from "firebase/firestore"; 
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [classes, setClasses] = useState([]);
const navigate = useNavigate();
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
    if (!user) navigate('/');
  }, [user, loading]);
  useEffect(() => {
    if (loading) return;
    fetchClasses();
  }, [user, loading]);
  return (
    <div><Navbar add={true}/> 
    
    <div className="dashboard">
      {classes?.length === 0 ? (
        <div className="dashboard__404" >
          No classes found! Join or create one!
        </div>
      ) : (
        <div className="dashboard__classContainer">
          {classes.map((individualClass) => (
            <ClassCard
              creatorName={individualClass.creatorName}
              creatorPhoto={individualClass.creatorPhoto}
              name={individualClass.name}
              id={individualClass.id}
              // style={{  marginBottom: 30 }}
            />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
export default Dashboard;