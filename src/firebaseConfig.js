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
  apiKey: "AIzaSyC4vbPx88tR70-YwldagYWjvx0K3AT1iPM",
  authDomain: "unskooler-28903.firebaseapp.com",
  projectId: "unskooler-28903",
  storageBucket: "unskooler-28903.appspot.com",
  messagingSenderId: "835481780969",
  appId: "1:835481780969:web:827a421641da1003946678",
  measurementId: "G-8N9TJWGSKT"
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