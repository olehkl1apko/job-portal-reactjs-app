import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "job-portal-e3faf.firebaseapp.com",
  projectId: "job-portal-e3faf",
  storageBucket: "job-portal-e3faf.appspot.com",
  messagingSenderId: "103546264789",
  appId: "1:103546264789:web:302e150c4026ab20a0d65c",
};

export const app = initializeApp(firebaseConfig);
export const fireDB = getFirestore(app);
