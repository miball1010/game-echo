import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCQRcooWvTGBnna54XGy81H6IDD1YIbX2s",
  authDomain: "game-echo-75441.firebaseapp.com",
  projectId: "game-echo-75441",
  storageBucket: "game-echo-75441.firebasestorage.app",
  messagingSenderId: "137329665802",
  appId: "1:137329665802:web:765f73f5f0578ee991bcf3",
  measurementId: "G-QKZRSNQC50"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

