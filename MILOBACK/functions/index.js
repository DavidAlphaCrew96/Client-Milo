const functions = require("firebase-functions");

const { notifyUsers } = require("./controllers/controllers");
const { validateFirebaseIdToken } = require("./middlewares/middlewares");
const express = require("express");
const { check } = require("express-validator");
const { validateInputs } = require("./middlewares/validate");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });

const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

//app.post("/miloLogin", emailSendgrid);

app.post(
  "/miloLogin",
  [
    check("email").not().isEmpty(),
    check("date").not().isEmpty(),
    check("phone").not().isEmpty(),
    validateInputs,
  ],
  notifyUsers
);

exports.apiMilo = functions.https.onRequest(app);
