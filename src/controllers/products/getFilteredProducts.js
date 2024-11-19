import { pool } from "../../utils/config/DBconfig.js";

export const getFilteredProducts = async (req, res, next) => {
  const filters = req.body;
  console.log(filters);

  // REDUCE FILTERS TO ARRAY TO CHECK IF EMPTY
  const reducedFilters = Object.keys(filters).reduce((acc, curr) => {
    if (typeof filters[curr] === "string" && filters[curr] !== "") {
      acc.push(filters[curr]);
      return acc;
    } else if (Array.isArray(filters[curr]) && filters[curr].length > 0) {
      filters[curr].forEach((item) => acc.push(item));
      return acc;
    } else {
      return acc;
    }
  }, []);

  // ALL PRODUCTS IF NO FILTERS
  if (reducedFilters.length === 0) {
    const [data] = await pool.execute(`
      SELECT products.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT('url', images.url, 'alt', images.alt)) AS images
      FROM products
      JOIN images ON products.id = images.product_id
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
        products.soldCount;
    `);
    console.log(data);

    return res.status(200).json(data);
  }

  let whereClause = "";
  const queryParams = [];

  // FILTER BY CATEGORY
  if (filters.category?.length > 0) {
    whereClause += ` AND products.category IN (${filters.category
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.category);
  }

  // FILTER BY PRICE
  if (filters.price?.length > 0) {
    whereClause += " AND (products.price > ? AND products.price < ?)";
    queryParams.push(filters.price[0], filters.price[1]);
  }

  // FILTER BY COLOR
  let colorsJoin = "";
  if (filters.color?.length > 0) {
    colorsJoin = `LEFT JOIN colors ON products.id = colors.product_id`;
    whereClause += ` AND colors.name IN (${filters.color
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.color);
  }

  // FILTER BY SIZE
  let sizesJoin = "";
  if (filters.size?.length > 0) {
    sizesJoin = `LEFT JOIN sizes ON products.id = sizes.product_id`;
    whereClause += ` AND sizes.size IN (${filters.size
      .map(() => "?")
      .join(", ")}) AND sizes.isAvailable = 1`;
    queryParams.push(...filters.size);
  }

  // FILTER BY BRAND
  if (filters.brand?.length > 0) {
    whereClause += ` AND products.brand IN (${filters.brand
      .map(() => "?")
      .join(", ")})`;
    queryParams.push(...filters.brand);
  }

  //! THIS SHOULD BE CHANGED AS BOOLEAN
  // FILTER BY DISCOUNT
  if (filters.discount?.discount === "Ja") {
    whereClause += " AND products.discountPercentage > 0";
  }

  try {
    const query = `
    SELECT products.*, 
      JSON_ARRAYAGG(
      JSON_OBJECT('url', images.url, 'alt', images.alt)) AS images
      FROM products
      ${colorsJoin}
      ${sizesJoin}
      JOIN images ON products.id = images.product_id
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
        products.soldCount;  
      `;

    const [data] = await pool.execute(query, queryParams);

    res.status(200).json(data);
  } catch (error) {
    console.error("Database Query Error:", error.message);
    next(error);
  }
};
