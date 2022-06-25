// Firebase
import firebaseSettings from "@/config/settings/firebase.js"
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
const firebaseApp = initializeApp(firebaseSettings.firebaseConfig);
getDatabase(firebaseApp);

console.log('hi');