import { pool } from "../../utils/config/DBconfig.js";

export const getAllProducts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const documentIndex = (page - 1) * limit;

  try {
    const [data] = await pool.execute(
      "SELECT * FROM products LIMIT ? OFFSET ?",
      [String(limit), String(documentIndex)]
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
