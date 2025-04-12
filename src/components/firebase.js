// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// إعدادات مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAIn6goAO6xiBXfi-DCYGTaV_nhrb5KNxk",
  authDomain: "tarshula-e3a32.firebaseapp.com",
  projectId: "tarshula-e3a32",
  storageBucket: "tarshula-e3a32.firebasestorage.app",
  messagingSenderId: "70257379047",
  appId: "1:70257379047:web:35c1426c969737c0244442",
  measurementId: "G-XCVXG6SG3B"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
