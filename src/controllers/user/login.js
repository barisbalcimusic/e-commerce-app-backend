import bcrypt from "bcrypt";
import { pool } from "../../utils/config/DBconfig.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
