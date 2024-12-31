import { pool } from "../../utils/config/DBconfig.js";
import { hashFunc } from "../../utils/crypto.js";
import { sanitizeInput } from "../../utils/sanitizer.js";
import validator from "validator";
import { testPassword } from "../../utils/testPassword.js";
import {
  mailOptionsFunc,
  transporterFunc,
} from "../../utils/config/mailConfig.js";
import { sendMailFunc } from "../../utils/sendMailFunc.js";
import crypto from "crypto";
import {
  verificationMailHTML,
  verificationMailSubject,
} from "../../utils/mailData.js.js";

export const register = async (req, res, next) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    // CHECK IF REQUIRED FIELDS ARE EMPTY
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "missingInput" });
    }

    // VALIDATE EMAIL
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return res.status(400).json({ message: "invalidEmailFormat" });
    }

    // SANITIZE INPUTS STEP 1 (SANITIZE-HTM)
    const sanitizedFirstname = sanitizeInput(firstname);
    const sanitizedLastname = sanitizeInput(lastname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // CHECK IF SANITIZED INPUTS ARE EMPTY (IF YES IT MEANS THERE WAS A SCRIPT TAG)
    if (
      !sanitizedFirstname ||
      !sanitizedLastname ||
      !sanitizedEmail ||
      !sanitizedPassword
    ) {
      return res.status(400).json({ message: "vorbiddenInput" });
    }

    // SANITIZE INPUTS STEP 2
    firstname = sanitizedFirstname.trim().toUpperCase();
    lastname = sanitizedLastname.trim().toUpperCase();
    email = sanitizedEmail.trim().toLowerCase();
    password = sanitizedPassword.trim();

    // VALIDATE PASSWORD (RETURNS BOOLEAN)
    const isPasswordValid = testPassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalidPassword",
      });
    }

    const [user] = await pool.execute("SELECT * FROM USERS WHERE email = ?", [
      email,
    ]);

    // CHECK IF USER ALREADY EXISTS
    if (user.length > 0) {
      return res.status(400).json({ message: "emailAlreadyExists" });
    }

    // HASH PASSWORD
    const hashedPassword = await hashFunc(password);

    //CREATE VERIFICATION TOKEN FOR EMAIL
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // HASH VERIFICATION TOKEN
    const hashedVerificationToken = await hashFunc(verificationToken);

    // INSERT USER INTO DATABASE
    const [result] = await pool.execute(
      `INSERT INTO users (firstname, lastname, email, password, verification_token) VALUES (?, ?, ?, ?, ?)`,
      [firstname, lastname, email, hashedPassword, hashedVerificationToken]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "userNotCreated" });
    }

    const deleteUser = async () => {
      try {
        await pool.query("DELETE FROM users WHERE id = ?", [result.insertId]);
        await pool.query("DELETE FROM carts WHERE user_id = ?", [
          result.insertId,
        ]);
      } catch (err) {
        console.error("Error while deleting user or cart:", err);
      }
    };

    //SEND VERIFICATION EMAIL
    const transporter = transporterFunc();
    const mailOptions = mailOptionsFunc(
      email,
      verificationMailSubject,
      verificationMailHTML(verificationToken, result.insertId)
    );
    const verificationMailSent = await sendMailFunc(transporter, mailOptions);

    if (!verificationMailSent) {
      await deleteUser();
      return res.status(500).json({ message: "verificationMailNotSent" });
    }

    req.user = { userId: result.insertId };

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
