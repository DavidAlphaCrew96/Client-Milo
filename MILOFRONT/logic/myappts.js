export function drawReservation() {
  const info = JSON.parse(localStorage.getItem("actualyDoctor"));
  const fullName = document.querySelector(".fullNameDoctor");
  const name = document.querySelector(".nameDoctor");
  const aboutDoctor = document.querySelector("#aboutDoctor");
  const videoIndividually = document.querySelector("#videoIndividually");
  if (info && fullName && name && aboutDoctor && videoIndividually) {
    fullName.textContent = info.names + " " + info.surnmaes;
    name.textContent = info.names;
    aboutDoctor.textContent = info.about_me;
    videoIndividually.src = info.urlProfile;
    videoIndividually.setAttribute("poster", info.imgProfile);
  }
}
