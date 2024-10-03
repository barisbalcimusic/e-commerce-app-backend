import { pool } from "../../utils/config/DBconfig.js";

export const deleteAllProducts = async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM products");
    res.status(200).json({ message: "All products have been deleted." });
  } catch (error) {
    next(error);
  }
};
