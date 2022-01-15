// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCQy1wZA9G-lROa24R0lNnvQ5lXYKVcV5g",
    authDomain: "twitter-clone-34b2d.firebaseapp.com",
    projectId: "twitter-clone-34b2d",
    storageBucket: "twitter-clone-34b2d.appspot.com",
    messagingSenderId: "195905970161",
    appId: "1:195905970161:web:f60fd1b804d68d0d4a2e50",
    measurementId: "G-GHEB1KMXXP"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { db, storage };
export default firebaseApp;
