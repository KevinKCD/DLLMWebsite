import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA3EYOaTN41jOH3ZlZbNMbbK-GkJX2u-VE',
  authDomain: 'uncleswebsite-81e55.firebaseapp.com',
  projectId: 'uncleswebsite-81e55',
  storageBucket: 'uncleswebsite-81e55.firebasestorage.app',
  messagingSenderId: '461247947418',
  appId: '1:461247947418:web:40dd48e863402ff5187523',
  measurementId: 'G-L1X14JRQFX',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
