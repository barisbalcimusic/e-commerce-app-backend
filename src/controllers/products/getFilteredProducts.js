import { pool } from "../../utils/config/DBconfig.js";

export const getFilteredProducts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const documentIndex = (page - 1) * limit;

  const { targetGroup, subCategory } = req.query;

  let whereClause = "";
  const queryParams = [];

  if (targetGroup) {
    whereClause += " AND targetGroup = ?";
    queryParams.push(targetGroup);
  }

  if (subCategory) {
    whereClause += " AND category = ?";
    queryParams.push(subCategory);
  }

  try {
    const [data] = await pool.execute(
      `SELECT * FROM products WHERE 1=1 ${whereClause} LIMIT ? OFFSET ?`,
      [...queryParams, String(limit), String(documentIndex)]
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
