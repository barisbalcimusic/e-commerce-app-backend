import { pool } from "../../utils/config/DBconfig.js";

export const getFilteredCount = async (req, res, next) => {
  const filters = req.body;

  let whereClause = "";
  const queryParams = [];

  // FILTER BY CATEGORY
  if (filters.category && filters.category.length > 0) {
    whereClause += ` AND products.category IN (${filters.category
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.category);
  }

  // FILTER BY PRICE
  if (filters.price && filters.price.length > 0) {
    whereClause += " AND (products.price > ? AND products.price < ?)";
    queryParams.push(filters.price[0], filters.price[1]);
  }

  // FILTER BY COLOR
  let colorsJoin = "";
  if (filters.color && filters.color.length > 0) {
    colorsJoin = `LEFT JOIN colors ON products.id = colors.product_id`;
    whereClause += ` AND colors.name IN (${filters.color
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.color);
  }

  // if (filters.size.length > 0) {
  //   whereClause += " AND products.size = ?";
  //   queryParams.push(filters.size);
  // }

  // FILTER BY BRAND
  if (filters.brand && filters.brand.length > 0) {
    whereClause += ` AND products.brand IN (${filters.brand
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.brand);
  }

  // if (filters.discount === "Ja") {
  //   whereClause += " AND products.discountPercentage > 0";
  //   queryParams.push(filters.discount);
  // }

  try {
    const query = `
      SELECT COUNT(DISTINCT products.id) AS filteredCount
      FROM products
      ${colorsJoin}
      WHERE 1=1 ${whereClause}`;

    const [data] = await pool.execute(query, queryParams);

    res.status(200).json({ data: data[0].filteredCount });
  } catch (error) {
    console.error("Database Query Error:", error.message);
    next(error);
  }
};
