import { pool } from "../../utils/config/DBconfig.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const [data] = await pool.execute("SELECT * FROM products");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
