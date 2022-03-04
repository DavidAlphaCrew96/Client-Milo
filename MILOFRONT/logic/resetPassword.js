import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCr5WcbESvtA2lNMPVD0WExd6wdArrdmEQ",
  authDomain: "milodb-23cec.firebaseapp.com",
  projectId: "milodb-23cec",
  storageBucket: "milodb-23cec.appspot.com",
  messagingSenderId: "250254375263",
  appId: "1:250254375263:web:6c3bc5957ddc7f156ddeea",
  measurementId: "G-GWN56YT0X5",
};

//Export firebase const
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const btnReset = document.querySelector("#send");

btnReset.addEventListener("click", verifycation);

function verifycation(e) {
  const inputText = document.querySelector("#resetPassword").value;
  e.preventDefault();

  sendPasswordResetEmail(auth, inputText)
    .then(() => {
      const section = document.querySelector("section");
      const message = document.createElement("P");
      message.textContent = "check your email to change the password";

      section.appendChild(message);
      setTimeout(() => {
        message.remove();
        window.location.replace("index.html");
      }, 2000);
    })
    .catch((error) => {
      console.error(error);
    });
}
