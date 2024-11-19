import { pool } from "../../utils/config/DBconfig.js";

export const getProductsByTargetGroup = async (req, res, next) => {
  const { targetGroup } = req.query;

  if (!targetGroup) {
    res.status(400).json({ message: "Bad Request: Missing targetGroup" });
    return;
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
      WHERE products.targetGroup = ?
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
        products.soldCount`;

    const [data] = await pool.execute(query, [targetGroup]);
    res.status(200).json(data);
  } catch (error) {
    console.error("Database Query Error:", error.message);
    next(error);
  }
};
