import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCYLTpDlnGGCRgrmt8SCgQcDw-LXBSaShc',
  authDomain: 'dllmwebsite.firebaseapp.com',
  projectId: 'dllmwebsite',
  storageBucket: 'dllmwebsite.firebasestorage.app',
  messagingSenderId: '759318078571',
  appId: '1:759318078571:web:e353c803c4d99502f9bd2e',
  measurementId: 'G-XBVC0ZM6RL',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
