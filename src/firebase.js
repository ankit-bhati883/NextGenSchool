import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import firestore from "firebase/firebase-firestore";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/firestore';

import { collection, query, where, getDocs ,addDoc } from "firebase/firestore"; 

// const querySnapshot = await getDocs(collection(db, "users"));
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
// });


// import firebase from '@firebase/app';
// require('firebase/auth');

// import { auth } from "firebase/compat/app";
// import "firebase/auth";
// // import * as firebase from 'firebase'
// import firebase from 'firebase/compat/app'
// require('firebase/auth')
// import firebase from 'firebase/compat/app';
// // import firebase from "firebase/app";
// // Add the Firebase products that you want to use
// import "firebase/auth";
// console.log(firebase.auth)


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
    // const querySnapshot = await getDocs(collection(db, "users")).where("uid", "==", user.uid);
    //  querySnapshot = querySnapshot.forEach((doc) => {
    //   if(doc.id == user.uid)) return doc.data();
    // });
    // const querySnapshot = await db
    //   .collection("users")
    //   .where("uid", "==", user.uid)
    //   .get();
    if (querySnapshot.docs.length === 0) {
      // create a new user
      const docRef=await addDoc(collection(db, "users"), {
        uid: user.uid,
        enrolledClassrooms: [],
      });
      console.log(docRef.id)
      // await db.collection("users").add({
      //   uid: user.uid,
      //   enrolledClassrooms: [],
      // });
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
