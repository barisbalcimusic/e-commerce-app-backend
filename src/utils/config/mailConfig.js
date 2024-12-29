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
export const mailOptionsFunc = (receiver, userId, verificationToken) => {
  const mailOptions = {
    from: sender,
    to: receiver,
    subject: "BuyTheWay email verification",
    html: `
    <html>
    <head>
        <style>
            h1 { color: #333; }
            h2 { color: #555; }
            p { font-size: 16px; }
            .container { 
                font-family: Verdana, Arial, sans-serif;
                padding: 20px; 
            }
            .button {
                text-decoration: none;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            }
            .button:link {
                color: blue;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 style="background-color:rgb(230, 156, 72); padding:10px;">Willkommen bei BuyTheWay!</h1>
            <h2>Vielen Dank für Ihre Registrierung</h2>
            <p>Hallo,</p>
            <p>Ihre Registrierung bei BuyTheWay war erfolgreich.</p>
            <p>Bitte klicken Sie auf den untenstehenden Link, um Ihre E-Mail-Adresse zu bestätigen:</p>
            <p><a href="https://proxy.barisbalci.de/api/auth/verifyUser?token=${verificationToken}&userId=${userId}" class="button">E-Mail bestätigen</a></p>
            <p>Wenn Sie Fragen haben, können Sie uns gerne kontaktieren.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr BuyTheWay-Team</p>
        </div>
    </body>
    </html>
    `,
  };
  return mailOptions;
};
