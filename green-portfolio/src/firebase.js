import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJPWjdYwxrEqtbcUZLYp7bMWuNi_arAoQ",
  authDomain: "ecoexchange-706dd.firebaseapp.com",
  projectId: "ecoexchange-706dd",
  storageBucket: "ecoexchange-706dd.appspot.com",
  messagingSenderId: "166224669077",
  appId: "1:166224669077:web:f1c0606234b4184e64ee9c",
  measurementId: "G-WP0QRQNWPQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Initialize Cloud Firestore and get a reference to the service
