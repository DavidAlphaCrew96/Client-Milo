const linkCal = document.querySelector("#calendly");

linkCal.addEventListener("click", startCalendly);

function startCalendly(e) {
  e.preventDefault();
  console.log("llego");
  Calendly.initPopupWidget({
    url: "https://calendly.com/david-alphacrewstudio",
  });
  return false;
}
