// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAnLqyTKiBZgBf-2bn5j-DFtBHt0I0mkE",
  authDomain: "opxcint.firebaseapp.com",
  databaseURL: "https://opxcint-default-rtdb.firebaseio.com",
  projectId: "opxcint",
  storageBucket: "opxcint.firebasestorage.app",
  messagingSenderId: "978767501597",
  appId: "1:978767501597:web:3d71595c627dbde51a29f4",
  measurementId: "G-K72PXXRS3W"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
