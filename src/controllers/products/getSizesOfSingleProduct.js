import { pool } from "../../utils/config/DBconfig.js";

export const getSizesOfSingleProduct = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const [data] = await pool.execute(
      `SELECT * FROM sizes WHERE product_id = ?`,
      [id]
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
