const nodemailer = require('nodemailer');
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: "martalitvinchuk90@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "mivovi8098@glumark.com",
  from: "martalitvinchuk90@meta.ua",
  subject: 'Verification email',
  html: "<p><strong>Test email</strong>from localhost:3000</p>"
}

transport.sendMail(email)
  .then(() => console.log("Email send success"))
  .catch(err => console.log(err.message));











  // const sgMail = require('@sendgrid/mail');

// const { SENDGRID_API_KEY } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//   const email = { ...data, from: "myjsstudy@gmail.com" };
//   await sgMail.send(email);
//   return true;
// }

// const email = {
//   to: "mivovi8098@glumark.com",
//   from: "myjsstudy@gmail.com",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong>from localhost:3000</p>"
// }

// sgMail.send(email)
//   .then(() => console.log("Email send success"))
//   .catch(err => console.log(err.message));

// module.exports = sendEmail;





