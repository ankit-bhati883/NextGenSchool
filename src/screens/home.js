import React, {useEffect} from 'react'
import "./home.css";
import N from '../assets/n.png'
import { auth, signInWithGoogle } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';



function Home() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) navigate('/dashboard');
    }, [loading, user]);
  return (
    <div className="home">
        <div className="home__container">
            <img
                src={N}
                alt="Google Classroom Image"
                className="home__image"
            />
            <button className="home__login" onClick={signInWithGoogle}>
                Login with Google
            </button>
        </div>
    </div>
  )
}

export default Home