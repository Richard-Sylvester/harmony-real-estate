import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcPg_YgBew6mWnGejYIeKTbXAo7yCQiyE",
  authDomain: "harmony-properties.firebaseapp.com",
  projectId: "harmony-properties",
  storageBucket: "harmony-properties.firebasestorage.app",
  messagingSenderId: "953943956923",
  appId: "1:953943956923:web:29957ca0e6752cfefbf89e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and the Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();