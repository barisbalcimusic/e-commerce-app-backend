import { pool } from "../../utils/config/DBconfig.js";
import { hashPassword } from "../../utils/crypto.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword]
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
