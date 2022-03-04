const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

//keys
const sendgrid = functions.config().sendgrid.apikey;
const accountSid = functions.config().twilio.accountsid;
const authToken = functions.config().twilio.authtoken;

/**Initialization */
sgMail.setApiKey(sendgrid);
const client = require("twilio")(accountSid, authToken);

async function notifyUsers(req, res) {
  const { email, date, phone } = req.body;

  const msg = {
    to: email,
    from: functions.config().sendgrid.adminmail,
    templateId: functions.config().sendgrid.templateid,
    dynamic_template_data: {
      subject: `Alpha Crew Studio reports: Your session has started at: ${date}`,
      //email: email,
      // message: message,
    },
  };

  try {
    const statusEmail = await sgMail.send(msg);

    const statusTwilio = await client.messages.create({
      body: "Alpha Crew Studio reports: Your session has started.",
      from: functions.config().twilio.adminnumber,
      to: phone,
    });

    res.status(200).json({
      sendgridEmail: statusEmail,
      twilioSms: statusTwilio,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error",
      error,
    });
  }
}

module.exports = { notifyUsers };
