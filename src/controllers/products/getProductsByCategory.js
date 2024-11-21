import { pool } from "../../utils/config/DBconfig.js";

export const getProductsByCategory = async (req, res, next) => {
  const { targetGroup, category } = req.query;

  if (!category) {
    res.status(400).json({ message: "Bad Request: Missing category" });
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
      ${
        targetGroup
          ? "WHERE products.targetGroup = ? AND products.category = ?"
          : "WHERE products.category = ?"
      }
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

    const queryParams = targetGroup ? [targetGroup, category] : [category];

    console.log(queryParams);

    const [data] = await pool.execute(query, queryParams);
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Database Query Error:", error.message);
    next(error);
  }
};
