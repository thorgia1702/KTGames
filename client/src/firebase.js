// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ktgames-29a1d.firebaseapp.com",
  projectId: "ktgames-29a1d",
  storageBucket: "ktgames-29a1d.appspot.com",
  messagingSenderId: "984036627680",
  appId: "1:984036627680:web:9ffbf8ef6242c571a76c85"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);