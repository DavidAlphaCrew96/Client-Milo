import { auth, drawProfile, specialtyDoctors, arrayGlobal } from "./app.js";
import { drawReservation } from "./myappts.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("No loggued");
    window.location = "index.html";
    throw new Error("No esta logueado");
  }


    const firstPanel = document.querySelector(".firstPanel");
    const secondPanel = document.querySelector(".secondPanel");
 
    if(firstPanel){
        firstPanel.style.display="grid";
        drawProfile(arrayGlobal, specialtyDoctors);
        drawReservation(arrayGlobal);
      //  document.querySelector("#loginBtn").style.display="none";
       // document.querySelector("#createAccountBtn").style.display="none";
    }

    if(secondPanel){
        secondPanel.style.display="grid";
        drawProfile(arrayGlobal, specialtyDoctors);
        drawReservation(arrayGlobal);
      //  document.querySelector("#loginBtn").style.display="none";
      //  document.querySelector("#createAccountBtn").style.display="none";
    }
 
 

 
});

