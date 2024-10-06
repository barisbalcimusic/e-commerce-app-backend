import { pool } from "../../utils/config/DBconfig.js";

export const getOrdersByUser = async (req, res, next) => {
  const { userId } = req.query;

  try {
    // FIND ALL ORDERS BY USER ID
    const [result] = await pool.execute(
      `SELECT * FROM orders WHERE user_id = ${userId}`
    );

    if (!result.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
