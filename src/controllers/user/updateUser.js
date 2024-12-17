import { pool } from "../../utils/config/DBconfig.js";

export const updateUser = async (req, res, next) => {
  try {
    const { fieldToEdit, newValue, userId } = req.body;

    if (!fieldToEdit || !newValue || !userId) {
      return res.status(400).json({ message: "missingFieldsForUpdate" });
    }

    const allowedFields = ["firstname", "lastname", "email", "password"];

    if (!allowedFields.includes(fieldToEdit)) {
      return res.status(400).json({ message: "invalidFieldUpdate" });
    }

    const query = `UPDATE users SET ${fieldToEdit} = ? WHERE id = ?`;

    const result = await pool.query(query, [newValue, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "canNotUpdate" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
