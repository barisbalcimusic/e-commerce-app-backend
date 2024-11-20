import { pool } from "../../utils/config/DBconfig.js";

export const getSingleProduct = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const query = `
    SELECT 
    products.*,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('url', url, 'alt', alt)
        )
        FROM (
            SELECT DISTINCT url, alt
            FROM images
            WHERE product_id = products.id
        ) AS unique_images
    ) AS images,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('size', size, 'isAvailable', isAvailable)
        )
        FROM (
            SELECT DISTINCT size, isAvailable
            FROM sizes
            WHERE product_id = products.id
        ) AS unique_sizes
    ) AS sizes,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('name', name, 'percentage', percentage)
        )
        FROM (
            SELECT DISTINCT name, percentage 
            FROM materials
            WHERE product_id = products.id
        ) AS unique_materials
    ) AS materials,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('instruction', instruction)
        )
        FROM (
            SELECT DISTINCT instruction 
            FROM care_instructions
            WHERE product_id = products.id
        ) AS unique_instructions
    ) AS instructions
    FROM products
    WHERE products.id = ?;`;
    const [data] = await pool.execute(query, [Number(id)]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
