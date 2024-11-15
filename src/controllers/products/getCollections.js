import { pool } from "../../utils/config/DBconfig.js";

export const getCollections = async (req, res, next) => {
  const { collection } = req.params;

  console.log(collection);

  if (!collection) {
    return res.status(400).json({ message: "Missing collection information" });
  }

  const allowedCollections = ["bestsellers", "sale", "favorites"];

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({ message: "Invalid collection type" });
  }

  try {
    const bestsellersQuery = `SELECT * FROM products ORDER BY soldCount DESC LIMIT 10`;
    const discountedQuery = `SELECT * FROM products WHERE discountPercentage > 0`;
    const favoritesQuery = `SELECT * FROM products WHERE rating > 4`;

    const query =
      collection === "bestsellers"
        ? bestsellersQuery
        : collection === "sale"
        ? discountedQuery
        : collection === "favorites"
        ? favoritesQuery
        : null;

    const [data] = await pool.execute(query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
