// Import the functions you need from the SDKs you need
import {
  getAuth,
  FacebookAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

export const auth = getAuth();
export let arrayGlobal = []; // contains summary information
export let specialtyDoctors = "neuro";
const btnGoogle = document.querySelector(".google"); //sing up with google
const btnTwitter = document.querySelector(".twitter");
const btnFacebook = document.querySelector(".facebook");
const btnCreateAccount = document.querySelector("#formCreateAccount");
const brnCancel = document.querySelector("#formCancel");
const btnFormLogin = document.querySelector("#loginWithUserPassword");
const logout = document.querySelector("#logout"); // finish session
let dataSummary;
let pagerDoctors = 0; //navigation aid between doctors
const btnAppointment = document.querySelector("#btnAppointment");
const btnBack = document.querySelector("#backFunction");
const btnNext = document.querySelector("#nextFunction");

/**LISTENERS */
if (btnGoogle && btnTwitter && btnFacebook) {
  btnGoogle.addEventListener("click", loginGoogle);
  btnTwitter.addEventListener("click", loginTwitter);
  btnFacebook.addEventListener("click", loginFacebook);
}

if (btnCreateAccount) {
  btnCreateAccount.addEventListener("submit", (e) => {
    createUserMilo(e);
  });
}

if (brnCancel) {
  brnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.querySelector("#formCreateAccount");
    form.reset();
  });
}

if (btnFormLogin) {
  btnFormLogin.addEventListener("submit", (e) => {
    loginMilo(e);
  });
}

if (logout) {
  logout.addEventListener("click", logoutSesion);
}

if (btnAppointment) {
  btnAppointment.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "myappts.html";
  });
}

if (btnBack) {
  btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    backFunction(arrayGlobal, specialtyDoctors);
  });
}

if (btnNext) {
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    nextFunction(arrayGlobal, specialtyDoctors);
  });
}

/**INTERACTIONS WITH FIREBASE  */
//Login with google
async function loginGoogle(e) {
  e.preventDefault();
  countConsults("loginGoogle");
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const dataUser = {
        lastLogin: new Date(),
        idUser: user.uid,
        nameUser: user.displayName,
      };
      localStorage.setItem("user", token);
      (async () => {
        await readSummary();
        await setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
        arrayGlobal = JSON.parse(localStorage.getItem("summary")) || [];
        window.location = "dashboard.html";
      })();
      const mail = user.email;
      (async (mail) => {
        const dataUser = await verifyUser(user.uid);
        if (!dataUser) {
          await notifyUser(mail);
        }
      })(mail);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Login Twitter
async function loginTwitter() {
  const provider = new TwitterAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;
      const user = result.user;
      const dataUser = {
        lastLogin: new Date(),
        idUser: user.uid,
        nameUser: user.displayName,
      };
      localStorage.setItem("user", token);
      (async () => {
        await readSummary();
        await setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
        arrayGlobal = JSON.parse(localStorage.getItem("summary")) || [];
        window.location = "dashboard.html";
      })();
      const mail = user.email;
      (async (mail) => {
        const dataUser = await verifyUser(user.uid);
        if (!dataUser) {
          await notifyUser(mail);
        }
      })(mail);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Login Facebook
async function loginFacebook() {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const dataUser = {
        lastLogin: new Date(),
        idUser: user.uid,
        nameUser: user.displayName,
      };
      localStorage.setItem("user", accessToken);
      (async () => {
        await readSummary();
        await setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
        arrayGlobal = JSON.parse(localStorage.getItem("summary")) || [];
        window.location = "dashboard.html";
      })();
      const mail = user.email;
      (async (mail) => {
        const dataUser = await verifyUser(user.uid);

        if (!dataUser) {
          await notifyUser(mail);
        }
      })(mail);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Create and Login manual
function createUserMilo(e) {
  e.preventDefault();
  const userF = document.querySelector("#formEmail").value;
  const repassword = document.querySelector("#formEmailVerify").value;
  const password = document.querySelector("#formPassword").value;
  const name = document.querySelector("#formFirstName").value;
  const surname = document.querySelector("#formLastName").value;
  const fullName = name + " " + surname;

  if (
    userF === "" ||
    password === "" ||
    name === "" ||
    surname === "" ||
    repassword === ""
  ) {
    console.log("An empty String cannot go");
    return;
  }
  createUserWithEmailAndPassword(auth, userF, password)
    .then((credenciales) => {
      const user = credenciales.user;
      const dataUser = {
        lastLogin: new Date(),
        idUser: user.uid,
        nameUser: fullName,
      };
      localStorage.setItem("user", user.accessToken);
      (async () => {
        await setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
        await readSummary();
        arrayGlobal = JSON.parse(localStorage.getItem("summary")) || [];
        window.location = "dashboard.html";
      })();
      const mail = user.email;
      (async (mail) => {
        await notifyUser(mail);
      })(mail);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function loginMilo(e) {
  e.preventDefault();
  const userF = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  if (userF === "" || password === "") {
    console.log("An empty String cannot go");
    return;
  }
  signInWithEmailAndPassword(auth, userF, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const dataUser = {
        lastLogin: new Date(),
        idUser: user.uid,
      };
      setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
      localStorage.setItem("user", userCredential.user.accessToken);
      (async () => {
        await setDoc(doc(db, "users", user.uid), dataUser, { merge: true });
        await readSummary();
        arrayGlobal = JSON.parse(localStorage.getItem("summary")) || [];
        window.location = "dashboard.html";
      })();
      const mail = user.email;
      (async (mail) => {
        const dataUser = await verifyUser(user.uid);
        if (!dataUser) {
          await notifyUser(mail);
        }
      })(mail);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Logout session
function logoutSesion(e) {
  e.preventDefault();
  auth.signOut().then(() => {
    localStorage.clear();
    window.location = "index.html";
  });
}

const db = getFirestore(); //instance with database

//read the summary of the table of doctors
async function readSummary() {
  countConsults();
  arrayGlobal = [];

  const docRef = doc(db, "doctors", "summary");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    dataSummary = docSnap.data();
  } else {
    console.log("Error");
  }

  for (const property in dataSummary) {
    //we add to the global variable arrayGlobal the data to paint the interface
    arrayGlobal.push(JSON.parse(`${JSON.stringify(dataSummary[property])}`));
  }
  //we save in the localstorage to reuse them
  localStorage.setItem("summary", JSON.stringify(arrayGlobal));
  await readDocumentByEmail(arrayGlobal[pagerDoctors].email); //this method retrieves the information of the first doctor it finds in the database
}

//Save in localstorage the information about the actualyDoctor
function restInterface(dataF) {
  const data = JSON.stringify(dataF);
  const data2 = JSON.parse(data);
  //we load the rest of the information
  restInfo = data2;
}

//
async function readDocumentByEmail(email) {
  countConsults();
  const q = query(collection(db, "doctors"), where("email", "==", email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    localStorage.setItem("actualyDoctor", JSON.stringify(doc.data()));
  });
}

async function notifyUser(email) {
  const loginSession = {
    email: email,
    date: new Date(),
    phone: "+593982828944",
  };
  const url =
    "https://us-central1-milodb-23cec.cloudfunctions.net/apiMilo/miloLogin";
  const response = await auth.currentUser.getIdToken();
  await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: "Bearer " + response,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(loginSession),
  });
}

async function verifyUser(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return true;
  } else {
    // doc.data() will be undefined in this case
    return false;
  }
}

/**INTERFACE */
//this graphic function in the interface the data of the doctors
export async function drawProfile(arrayGlobal, specialtyDoctors) {
  const arrayGlobalFilter = arrayGlobal.filter(
    (arr) => arr.especially === specialtyDoctors
  );

  const data = JSON.parse(localStorage.getItem("actualyDoctor"));

  const imagenProfile = document.querySelector("#imageProfileF");

  if (imagenProfile) {
    imagenProfile.src = data.imgProfile;
  }

  const nameDoctor = document.querySelector(".content-profile h2");
  if (nameDoctor) {
    nameDoctor.textContent = data.names;
  }

  const titleDoctor = document.querySelector(".content-profile p");
  if (titleDoctor) {
    titleDoctor.textContent = data.title;
  }
  const especiality = document.querySelector("#specialities");
  if (especiality) {
    especiality.textContent = data.especially;
  }

  const experience = document.querySelector("#experience");
  if (experience) {
    experience.textContent = data.experience;
  }

  const langes = document.querySelector("#languages");
  if (langes) {
    langes.textContent = "";

    for (let index = 0; index < data.lenguages.length; index++) {
      langes.textContent += data.lenguages[index] + "\n";
    }
  }

  const nameLateral = document.querySelector(".fullNamePane");
  if (nameLateral) {
    nameLateral.textContent = data.names;
  }
  const presentationVideo = document.querySelector("video");
  if (presentationVideo) {
    presentationVideo.src = data.urlProfile;
    presentationVideo.setAttribute("poster", data.imgProfile);
  }
}

//Navigations buttons
async function nextFunction(arrayGlobal, specialtyDoctors) {
  const recuperar = JSON.parse(localStorage.getItem("summary"));
  if (pagerDoctors < recuperar.length - 1) {
    pagerDoctors++;

    await readDocumentByEmail(recuperar[pagerDoctors].email);

    drawProfile(arrayGlobal, specialtyDoctors);
  } else {
    console.log("No more doctors");
  }
}

async function backFunction() {
  if (pagerDoctors > 0) {
    pagerDoctors--;
    const recuperar = JSON.parse(localStorage.getItem("summary"));

    await readDocumentByEmail(recuperar[pagerDoctors].email);

    drawProfile(arrayGlobal, specialtyDoctors);
  } else {
    console.log("No more doctors");
  }
}

const consults = JSON.parse(localStorage.getItem("consultas")) || [];
function countConsults(accion) {
  consults.push(accion);
  localStorage.setItem("consultas", JSON.stringify(consults));

  console.log(consults);
}
