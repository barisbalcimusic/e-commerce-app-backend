import { pool } from "../../utils/config/DBconfig.js";

export const postOrder = async (req, res, next) => {
  try {
    const { adress, paymentMethod, cartItems } = req.body;

    // const orderDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await pool.query(
      "INSERT INTO orders (user_id, order_date, total_amount) VALUES (?, ?, ?)",
      [id, orderDate, total]
    );

    // const orderId = result.insertId;

    // for (const product of order.orderedProducts) {
    //   await pool.execute(
    //     "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    //     [orderId, product.id, product.amount, product.singlePrice]
    //   );
    // }

    res.status(201).json({ message: "Order received!" });
  } catch (error) {
    next(error);
  }
};
