import { pool } from "../../utils/config/DBconfig.js";
import { hashPassword } from "../../utils/crypto.js";
import { sanitizeInput } from "../../utils/sanitizer.js";

export const register = async (req, res, next) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    // CHECK IF REQUIRED FIELDS ARE EMPTY
    if (!firstname || !lastname || !email || !password) {
      req.status(400).json({ message: "Please provide all required fields" });
    }

    // SANITIZE INPUTS STEP 1
    const sanitizedFirstname = sanitizeInput(firstname);
    const sanitizedLastname = sanitizeInput(lastname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // CHECK IF SANITIZED INPUTS ARE EMPTY
    if (
      !sanitizedFirstname ||
      !sanitizedLastname ||
      !sanitizedEmail ||
      !sanitizedPassword
    ) {
      return res.status(400).json({ message: "Please provide valid inputs" });
    }

    // SANITIZE INPUTS STEP 2
    firstname = sanitizedFirstname.trim().toUpperCase();
    lastname = sanitizedLastname.trim().toUpperCase();
    email = sanitizedEmail.trim().toLowerCase();
    password = sanitizedPassword.trim();

    const [user] = await pool.execute("SELECT * FROM USERS WHERE email = ?", [
      email,
    ]);

    // CHECK IF USER ALREADY EXISTS
    if (user.length > 0) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exists` });
    } else {
      // HASH PASSWORD
      const hashedPassword = await hashPassword(password);

      // INSERT USER INTO DATABASE
      const [result] = await pool.execute(
        `INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
        [firstname, lastname, email, hashedPassword]
      );

      if (result.affectedRows === 0) {
        return res
          .status(500)
          .json({ message: `Server error. User could not be created.` });
      }

      res
        .status(201)
        .json({ message: `User ${email} has been successfully created.` });
    }
  } catch (error) {
    next(error);
  }
};
