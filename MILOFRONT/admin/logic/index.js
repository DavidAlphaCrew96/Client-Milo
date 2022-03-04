import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getAuth,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCr5WcbESvtA2lNMPVD0WExd6wdArrdmEQ",
  authDomain: "milodb-23cec.firebaseapp.com",
  projectId: "milodb-23cec",
  storageBucket: "milodb-23cec.appspot.com",
  messagingSenderId: "250254375263",
  appId: "1:250254375263:web:6c3bc5957ddc7f156ddeea",
  measurementId: "G-GWN56YT0X5"
};





// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore();

async function insertData() {
  const id = "id" + Math.random().toString(16).slice(2);

  const infoDoctor = {
     id,
    names: "David",
    surnmaes: "Egas",
    age: 18,
    direction: "Libertador avenue",
    phone: "+593982828945",
    email: "correo30@correo.com",
    title: "Neurosurgeon Doctor",
    lenguages: ["Spanchis", "German"],
    experience: "I worked in several Latin American clinics in social aid projects ",
    about_me: "I like to work with everyone who needs my help",
    especially: "Neuro Surgeon",
    imgProfile:"https://image.shutterstock.com/image-photo/portrait-toothy-smiling-joyfully-laughing-600w-1528782020.jpg",
    urlProfile:"https://storage.coverr.co/videos/ocZV2zcu8paXbvjYPJ7QKKsDjBn7ltlT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijg3NjdFMzIzRjlGQzEzN0E4QTAyIiwiaWF0IjoxNjQ1MDI4OTY4fQ.r6-JeRXzunEpuHJUs0egdd1OlKyIWqoldTGLnkNqEbM",


  /*  id,
    names: "Arianna",
    surnmaes: "Grande",
    age: 18,
    direction: "Michigan avenue",
    phone: "+593982828945",
    email: "correo10@correo.com",
    title: "Neurosurgeon Doctor",
    lenguages: ["English", "French"],
    experience:
      "I worked in a hospital in the state of Chicago and also had my own practice to help people in the sector. ",
    about_me:
      "I like to work with everyone who needs my helpI am a cheerful person who likes to help people who need me.",
    especially: "Neuro Surgeon",
    imgProfile:
      "https://image.shutterstock.com/image-photo/beautiful-blonde-woman-wearing-casual-600w-1908782572.jpg",
    urlProfile:
      "https://ak.picdn.net/shutterstock/videos/1043980210/preview/stock-footage-serious-young-african-businessman-wear-headset-conference-calling-by-webcam-focused-mix-race.webm",
   */
      // https://ak.picdn.net/shutterstock/videos/1043980210/preview/stock-footage-serious-young-african-businessman-wear-headset-conference-calling-by-webcam-focused-mix-race.webm
    // https://storage.coverr.co/videos/ocZV2zcu8paXbvjYPJ7QKKsDjBn7ltlT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijg3NjdFMzIzRjlGQzEzN0E4QTAyIiwiaWF0IjoxNjQ1MDI4OTY4fQ.r6-JeRXzunEpuHJUs0egdd1OlKyIWqoldTGLnkNqEbM

    //https://image.shutterstock.com/image-photo/portrait-toothy-smiling-joyfully-laughing-600w-1528782020.jpg
    //https://image.shutterstock.com/image-photo/beautiful-blonde-woman-wearing-casual-600w-1908782572.jpg
  };

  const sumary = {
    doctor1: {
      id,

      email: "correo30@correo.com",
    },
  };
  await setDoc(doc(db, "doctors", id), infoDoctor, { merge: true });
  await setDoc(doc(db, "doctors", "summary"), sumary, { merge: true });
}

async function createAppoint() {
  const idAppoint = "id" + Math.random().toString(16).slice(2);
  const user = localStorage.getItem("usuario");
  const doctor = JSON.parse(localStorage.getItem("doctorAcutalRestoInfo"));

  const elapsedTime = Date.now();
  const now = new Date(elapsedTime);

  const infoAppoint = {
    idAppoint,
    date: now.toDateString(),
    hour: "10:00",
    duration: 2,
    observations: "Requiere que lleve un cuaderno",
    user,
    doctor: doctor.id,
  };

  await setDoc(doc(db, "appointmens", idAppoint), infoAppoint, { merge: true });
}

const btn = document.querySelector("button");
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  await insertData();
});

const btnAppoint = document.querySelector("#appoint");
btnAppoint.addEventListener("click", async (e) => {
  e.preventDefault();
  await createAppoint();
});
