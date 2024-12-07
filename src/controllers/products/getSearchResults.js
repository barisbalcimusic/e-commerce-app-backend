import { pool } from "../../utils/config/DBconfig.js";

export const getSearchResults = async (req, res, next) => {
  try {
    const { inputValue } = req.query;

    if (!inputValue) {
      res.status(400).json({ message: "Missing input value" });
    }

    // WILDCARD
    const searchValue = `%${inputValue}%`;

    const query = `
    SELECT id, name, description, category, targetGroup, brand FROM products 
    WHERE name LIKE ?
    OR description LIKE ?
    OR category LIKE ?
    OR targetGroup LIKE ?
    OR brand LIKE ?
    `;

    const [data] = await pool.query(query, [
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
    ]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
