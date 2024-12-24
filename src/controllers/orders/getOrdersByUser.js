import { pool } from "../../utils/config/DBconfig.js";

export const getOrdersByUser = async (req, res, next) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "userIdRequired" });
  }

  try {
    // FIND ALL ORDERS BY USER ID
    const [result] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ?`,
      [userId]
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
