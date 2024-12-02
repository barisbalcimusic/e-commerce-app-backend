import { pool } from "../../utils/config/DBconfig.js";
import fs from "fs";

export const getProductsByCollection = async (req, res, next) => {
  const { collection, category, targetGroup } = req.query;

  if (!collection) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing collection information" });
  }

  const allowedCollections = [
    "bestsellers",
    "discounted",
    "favorites",
    "similar",
  ];

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({ message: "Invalid collection type" });
  }

  try {
    const queries = {
      bestsellers: fs.readFileSync("src/queries/bestsellers.sql", "utf-8"),
      discounted: fs.readFileSync("src/queries/discounted.sql", "utf-8"),
      favorites: fs.readFileSync("src/queries/favorites.sql", "utf-8"),
      similar: fs.readFileSync("src/queries/similar.sql", "utf-8"),
    };

    const query = queries[collection];

    const [data] = await pool.execute(
      query,
      category && targetGroup ? [category, targetGroup] : null
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
