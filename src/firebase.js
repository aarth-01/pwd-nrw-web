import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmStDxEzrbFExN1yWk2cdJqxNYvyKJDX4",
  authDomain: "nrw-realloss.firebaseapp.com",
  projectId: "nrw-realloss",
  storageBucket: "nrw-realloss.firebasestorage.app",
  messagingSenderId: "343904658215",
  appId: "1:343904658215:web:2d9e54d320e450c696ff02",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);