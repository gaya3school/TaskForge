import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
     apiKey: "AIzaSyDCHBDEGZgfyR1b7iUk6_nCvGdHdEICTHI",
     authDomain: "taskforgedb.firebaseapp.com",
     projectId: "taskforgedb",
     storageBucket: "taskforgedb.firebasestorage.app",
     messagingSenderId: "178641473693",
     appId: "1:178641473693:web:c5829d4c7c435894290474",
     measurementId: "G-N60N9C2Y2T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
