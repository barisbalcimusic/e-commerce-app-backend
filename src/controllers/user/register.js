import { pool } from "../../utils/config/DBconfig.js";
import { hashPassword } from "../../utils/crypto.js";
import { sanitizeInput } from "../../utils/sanitizer.js";
import validator from "validator";
import { testPassword } from "../../utils/testPassword.js";

export const register = async (req, res, next) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    // CHECK IF REQUIRED FIELDS ARE EMPTY
    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({ message: "missingInput" });
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
    } else {
      // HASH PASSWORD
      const hashedPassword = await hashPassword(password);

      // INSERT USER INTO DATABASE
      const [result] = await pool.execute(
        `INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
        [firstname, lastname, email, hashedPassword]
      );

      if (result.affectedRows === 0) {
        return res.status(500).json({ message: "dbError" });
      }

      res.status(201).json({ message: "success" });
    }
  } catch (error) {
    next(error);
  }
};
