import { pool } from "../../utils/config/DBconfig.js";

export const getFilteredProducts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { targetGroup, subCategory } = req.query;

  let whereClause = "";
  const queryParams = [];

  if (targetGroup) {
    whereClause += " AND products.targetGroup = ?";
    queryParams.push(targetGroup);
  }

  if (subCategory) {
    whereClause += " AND products.category = ?";
    queryParams.push(subCategory);
  }

  try {
    const query = `
      SELECT 
        products.*,
        JSON_ARRAYAGG(
          JSON_OBJECT('url', images.url, 'alt', images.alt)
        ) AS images
      FROM products
      LEFT JOIN images ON products.id = images.product_id
      WHERE 1=1 ${whereClause}
      GROUP BY 
        products.id, 
        products.name, 
        products.description, 
        products.category, 
        products.targetGroup, 
        products.brand, 
        products.price, 
        products.rating, 
        products.discountPercentage, 
        products.stock, 
        products.soldCount
      ORDER BY products.soldCount DESC
      LIMIT ? OFFSET ?`;

    queryParams.push(String(limit), String(offset));

    const [data] = await pool.execute(query, queryParams);

    res.status(200).json(data);
  } catch (error) {
    console.error("Database Query Error:", error.message);
    next(error);
  }
};
