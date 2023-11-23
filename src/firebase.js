import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import {  getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnhi0RBNUySPAEXlCXsKqp0JbEjN5Wtck",
  authDomain: "tpfinalcui.firebaseapp.com",
  projectId: "tpfinalcui",
  storageBucket: "tpfinalcui.appspot.com",
  messagingSenderId: "849248699227",
  appId: "1:849248699227:web:526d753158f670184a507e"
  };

const app = initializeApp(firebaseConfig);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;