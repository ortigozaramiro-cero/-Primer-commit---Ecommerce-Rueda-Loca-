
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqYejmh7TS85GGafb7CeGRgeCnL-4SxSg",
  authDomain: "mi-ecomerce1.firebaseapp.com",
  projectId: "mi-ecomerce1",
  storageBucket: "mi-ecomerce1.firebasestorage.app",
  messagingSenderId: "581164482039",
  appId: "1:581164482039:web:b45bd476670bfcd59802f2"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


