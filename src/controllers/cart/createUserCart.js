import { pool } from "../../utils/config/DBconfig.js";

export const createUserCart = async (req, res, next) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ message: "userIdRequired" });
    }

    const [data] = await pool.query(`INSERT INTO carts (user_id) VALUES (?)`, [
      userId,
    ]);

    if (data.affectedRows === 0) {
      return res.status(400).json({ message: "cartNotCreated" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
