import { pool } from "../../utils/config/DBconfig.js";

export const emptyUserCart = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ message: "userIdRequired" });
    }

    const [data] = await pool.query(
      `DELETE FROM cart_items 
      WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)`,
      [userId]
    );

    if (data.affectedRows === 0) {
      return res.status(400).json({ message: "cartNotEmptied" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
