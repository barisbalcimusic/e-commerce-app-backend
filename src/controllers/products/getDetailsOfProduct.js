import { pool } from "../../utils/config/DBconfig.js";

export const getDetailsOfProduct = async (req, res, next) => {
  const { detail, id } = req.params;

  if (!detail || !id) {
    return res.status(400).json({ message: "Missing asd or id information" });
  }

  const allowedDetails = [
    "sizes",
    "colors",
    "images",
    "materials",
    "care_instructions",
  ];

  if (!allowedDetails.includes(detail)) {
    return res.status(400).json({ message: "Invalid detail type" });
  }

  try {
    const [data] = await pool.execute(
      `SELECT * FROM ${detail} WHERE product_id = ?`,
      [id]
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
