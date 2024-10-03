import { pool } from "../../utils/config/DBconfig.js";

export const postOrder = async (req, res, next) => {
  try {
    const { id, total, order } = req.body;

    const orderDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool.execute(
      "INSERT INTO orders (user_id, order_date, total_amount) VALUES (?, ?, ?)",
      [id, orderDate, total]
    );

    res.status(201).json({ message: "Order received!" });
  } catch (error) {
    next(error);
  }
};
