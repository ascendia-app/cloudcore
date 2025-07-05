// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCN-Cv8ZBGAM6YDTbwp1MdSMrgv8dgw_Ys",
  authDomain: "cloudcore-f29e2.firebaseapp.com",
  projectId: "cloudcore-f29e2",
  storageBucket: "cloudcore-f29e2.firebasestorage.app",
  messagingSenderId: "382923348965",
  appId: "1:382923348965:web:14fb1b835b053c94e82d0c",
  measurementId: "G-QZ5NGHQJ5B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
