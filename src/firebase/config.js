import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyCQAZ-gnrE2ZyqlyTs6ADNMwWTfnD89b2I",
  authDomain: "booklibrary-7eff2.firebaseapp.com",
  projectId: "booklibrary-7eff2",
  storageBucket: "booklibrary-7eff2.firebasestorage.app",
  messagingSenderId: "654371794757",
  appId: "1:654371794757:web:4f46033f73d425bded582c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore references
const booksRef = collection(db, "books");
const borrowedBooksRef = collection(db, "borrowedBooks");

export { db, booksRef, borrowedBooksRef, addDoc, getDocs, deleteDoc, doc };
