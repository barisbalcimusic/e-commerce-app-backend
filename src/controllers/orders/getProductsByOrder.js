import { pool } from "../../utils/config/DBconfig.js";

export const getProductsByOrder = async (req, res, next) => {
  const { userId } = req.user;
  const { orderId } = req.query;

  try {
    const [result] = await pool.query(
      `
      SELECT orders.id, orders.user_id, order_items.product_id, order_items.quantity, products.name, products.price
      FROM orders
      JOIN order_items
        ON orders.id = order_items.order_id
      JOIN products
        ON order_items.product_id = products.id
      WHERE orders.user_id = ? 
        AND orders.id = ?`,
      [Number(userId), [Number(orderId)]]
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
