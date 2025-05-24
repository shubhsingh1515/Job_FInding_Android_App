// Import the functions you need from the SDKs you need
//  import { initializeApp } from "firebase/app";
//  import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKJOfIP4EHnUqyGf6nil0_xI9OXSMAZuM",
  authDomain: "jobfindingapp-62d75.firebaseapp.com",
  projectId: "jobfindingapp-62d75",
  storageBucket: "jobfindingapp-62d75.appspot.com",
  messagingSenderId: "225981175744",
  appId: "1:225981175744:web:505645ca7e488b4ee11a25",
  measurementId: "G-X5B6JSZ7JW",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig); 

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export { firebase };
