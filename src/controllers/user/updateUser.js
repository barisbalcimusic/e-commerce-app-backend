import { pool } from "../../utils/config/DBconfig.js";

export const updateUser = async (req, res, next) => {
  try {
    const { fieldToEdit, value, userId } = req.body;

    const allowedFields = ["firstname", "lastname", "password"];

    if (!allowedFields.includes(fieldToEdit)) {
      return res.status(400).json({ message: "Invalid field to update." });
    }

    const query = `UPDATE users SET ${fieldToEdit} = ? WHERE user_id = ?`;

    await pool.execute(query, [value, userId]);

    res.status(200).json({ message: `${fieldToEdit} has been updated.` });
  } catch (error) {
    next(error);
  }
};
