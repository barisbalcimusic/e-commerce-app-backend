import { pool } from "../../utils/config/DBconfig.js";

export const updateProductsInCart = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const cartItems = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({ message: "missingUserIdOrCartItems" });
    }

    // GET CART ID OF USER
    const [[{ id }]] = await pool.query(
      `SELECT id FROM carts WHERE user_id = ?`,
      [userId]
    );

    // DELETE ALL PRODUCTS OF USER FROM CART ITEMS TABLE
    const deleteQuery = `
      DELETE FROM cart_items 
      WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?);
    `;
    await pool.query(deleteQuery, [userId]);

    // ADD PRODUCTS COMING FROM REQUEST TO CART ITEMS TABLE
    const addQuery = `
      INSERT INTO cart_items (cart_id, product_id, size, quantity)
      VALUES (?, ?, ?, ?); 
    `;
    for (const cartItem of cartItems) {
      await pool.query(addQuery, [
        id,
        cartItem.product.id,
        cartItem.size,
        cartItem.quantity,
      ]);
    }

    console.log("updateProductsInCart called");

    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
