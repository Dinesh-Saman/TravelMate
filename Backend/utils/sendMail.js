const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "travelmate265@gmail.com",
      pass: "travelmate123",
    },
  });

  const mailOptions = {
    from: "travelmate265@gmail.com",
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);

  console.log("Email sent successfully");
}

module.exports = sendMail;
