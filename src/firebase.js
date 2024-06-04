// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDay2GC28ZoCDvquCkAC_0x3Ex2rtIe358",
    authDomain: "oss-3-dd070.firebaseapp.com",
    projectId: "oss-3-dd070",
    storageBucket: "oss-3-dd070.appspot.com",
    messagingSenderId: "790752965200",
    appId: "1:790752965200:web:cffe4aab7febebd10c5755"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
