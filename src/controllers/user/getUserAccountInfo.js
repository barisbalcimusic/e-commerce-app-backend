import e from "express";
import { pool } from "../../utils/config/DBconfig.js";

export const getUserAccountInfo = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const [[user]] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!user) {
      return res.status(404).json({ message: "userNotFound" });
    }

    res.status(200).json({
      message: "success",
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
