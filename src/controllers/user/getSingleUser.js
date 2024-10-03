import { pool } from "../../utils/config/DBconfig.js";

export const getSingleUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [[user]] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
