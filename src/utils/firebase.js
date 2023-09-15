import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore"

const API_KEY = process.env.REACT_APP_API_KEY
const REACT_APP_AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN
const REACT_APP_PROJECT_ID = process.env.REACT_APP_PROJECT_ID
const REACT_APP_STORAGE_BUCKET = process.env.REACT_APP_STORAGE_BUCKET
const REACT_APP_MESSAGING_SENDER_ID = process.env.REACT_APP_MESSAGING_SENDER_ID
const REACT_APP_APP_ID = process.env.REACT_APP_APP_ID
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_API_KEY,
};


export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore();