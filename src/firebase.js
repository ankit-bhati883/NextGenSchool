import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/firestore';

import { collection, query, where, getDocs ,addDoc } from "firebase/firestore"; 

//Api

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = getFirestore();


const googleProvider = new firebase.auth.GoogleAuthProvider();

// Sign in and check or create account in firestore
const signInWithGoogle = async () => {
  try {
    const response = await auth.signInWithPopup(googleProvider);
    console.log(response.user);
    const user = response.user;
    console.log(`User ID - ${user.uid}`);

    const q=query(collection(db,"users"),where("uid","==",user.uid))
    const querySnapshot=await getDocs(q);
   
    if (querySnapshot.docs.length === 0) {
      // create a new user
      const docRef=await addDoc(collection(db, "users"), {
        uid: user.uid,
        enrolledClassrooms: [],
      });
      console.log(docRef.id)
    }
  } catch (err) {
    alert(err.message);
    console.log(err)
    console.log(err.message)
  }
};

const logout = () => {
  auth.signOut();
};

export { app, auth, db, signInWithGoogle, logout };
