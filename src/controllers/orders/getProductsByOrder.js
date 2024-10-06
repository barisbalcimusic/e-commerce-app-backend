import { pool } from "../../utils/config/DBconfig.js";

export const getProductsByOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `SELECT orders.order_id, order_items.product_id, order_items.quantity, products.product_title, products.product_price
      FROM orders
      JOIN order_items
      ON orders.order_id = order_items.order_id
      JOIN products
      ON order_items.product_id = products.product_id
      WHERE orders.order_id = ?`,
      [Number(id)]
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
