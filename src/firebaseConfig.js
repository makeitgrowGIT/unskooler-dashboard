// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/storage';  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbT6mi-a654a7X8UBwGy_OJ47ElLUAiNI",
  authDomain: "unskooler-feefd.firebaseapp.com",
  projectId: "unskooler-feefd",
  storageBucket: "unskooler-feefd.appspot.com",
  messagingSenderId: "991066561746",
  appId: "1:991066561746:web:2da34ad4b045080601e10b",
  measurementId: "G-PXBCKKXT2S"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);


firebase.initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = firebase.firestore();
export const storage = firebase.storage();
// export const storage = firebase.storage();