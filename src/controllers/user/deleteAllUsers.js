import { pool } from "../../utils/config/DBconfig.js";

export const deleteAllUsers = async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM users");
    res.status(200).json({ message: "All users have been deleted." });
  } catch (error) {
    next(error);
  }
};
