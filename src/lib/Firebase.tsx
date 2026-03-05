// firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCYLTpDlnGGCRgrmt8SCgQcDw-LXBSaShc',
  authDomain: 'dllmwebsite.firebaseapp.com',
  projectId: 'dllmwebsite',
  storageBucket: 'dllmwebsite.firebasestorage.app',
  messagingSenderId: '759318078571',
  appId: '1:759318078571:web:e353c803c4d99502f9bd2e',
  measurementId: 'G-XBVC0ZM6RL',
};

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services with proper types
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;