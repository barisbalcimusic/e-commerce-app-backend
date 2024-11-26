import { pool } from "../../utils/config/DBconfig.js";
import fs from "fs";

export const getFilters = async (req, res, next) => {
  try {
    const query = fs.readFileSync("src/queries/filters.sql", "utf-8");
    const [data] = await pool.query(query);

    const sortOptions = {
      filterCategory: "sort",
      filterOptions: [
        "Preis aufsteigend",
        "Preis absteigend",
        "Name A-Z",
        "Name Z-A",
        "Rabatt",
        "Meistverkauft",
      ],
      inputType: "radio",
    };

    const filters = [sortOptions, ...data];

    console.log(filters);

    res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
};
