import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCulAbt4lHMBGcxnFd0E0XbYVSuFcAadzw",
  authDomain: "skill-g.firebaseapp.com",
  projectId: "skill-g",
  storageBucket: "skill-g.firebasestorage.app",
  messagingSenderId: "1027389515653",
  appId: "1:1027389515653:web:fb41ebd668b7fa9d8486ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Flag to indicate Firebase is configured (using hardcoded config now)
export const isFirebaseConfigured = true;
