import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sender = process.env.EMAIL_ADDRESS;
const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;
const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;

//EMAIL CONFIGURATION
export const transporterFunc = () => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user: user,
      pass: password,
    },
  });

  return transporter;
};

//MAIL OPTIONS
export const mailOptionsFunc = (
  receiver,
  subject,
  html
) => {
  const mailOptions = {
    from: sender,
    to: receiver,
    subject,
    html,
  };
  return mailOptions;
};
