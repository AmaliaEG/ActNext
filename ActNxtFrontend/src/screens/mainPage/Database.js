import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, 
  getDocs, updateDoc, doc 
} from 'firebase/firestore';

// 1. Firebase Configuration + Initialization
const firebaseConfig = {
    apiKey: "AIzaSyA2EbaDxLW9Eb3hE6RI4fj90yIugns_3YU",
    authDomain: "actnxt.firebaseapp.com",
    projectId: "actnxt",
    storageBucket: "actnxt.firebasestorage.app",
    messagingSenderId: "388475739879",
    appId: "1:388475739879:web:b79d77b5dfb5b9f5f10c42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Database Operations
export const Database = {
    async getTasks() {
      const snapshot = await getDocs(collection(db, 'tasks'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date
        dateAssigned: doc.data().dateAssigned?.toDate() || new Date()
      }));
    },
  
    async logTaskInteraction(taskId, action) {
        await updateDoc(doc(db, 'tasks', taskId), {
            lastAction: action,
            updatedAt: new Date().toISOString()
        });
    }
};