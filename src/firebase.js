// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyD65Zx1x_3KNTU7PoQ_Z_Td3AOJirpJOqY",
   authDomain: "canvas-project-17070.firebaseapp.com",
   projectId: "canvas-project-17070",
   storageBucket: "canvas-project-17070.firebasestorage.app",
   messagingSenderId: "1068756630327",
   appId: "1:1068756630327:web:7913d1936d2dda68fbb8b2",
   measurementId: "G-45HWL95FV2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
