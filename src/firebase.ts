

// src/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB05BESHEsgffXXfSPDjt8wvPWxTXG9da0",
  authDomain: "cougarquest-62ba2.firebaseapp.com",
  projectId: "cougarquest-62ba2",
  storageBucket: "cougarquest-62ba2.firebasestorage.app",
  messagingSenderId: "930268237097",
  appId: "1:930268237097:web:3a0a7050ef9923e784bb38",
  measurementId: "G-T20RS3D7C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (if running in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize other Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized services
export { app, analytics, auth, db, storage };