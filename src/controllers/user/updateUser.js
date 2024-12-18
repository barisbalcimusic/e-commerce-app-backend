import { pool } from "../../utils/config/DBconfig.js";
import { sanitizeInput } from "../../utils/sanitizer.js";

export const updateUser = async (req, res, next) => {
  try {
    const { fieldToEdit, newValue, userId } = req.body;

    if (!newValue) {
      return res.status(400).json({ message: "missingInput" });
    }

    if (!fieldToEdit || !userId) {
      return res.status(400).json({ message: "missingUpdateData" });
    }

    const allowedFields = ["firstname", "lastname", "email"];

    if (!allowedFields.includes(fieldToEdit)) {
      return res.status(400).json({ message: "invalidFieldUpdate" });
    }

    let sanitizedNewValue;

    // SANITIZE INPUT STEP 1 (SANITIZE-HTML)
    sanitizedNewValue = sanitizeInput(newValue);

    // CHECK IF SANITIZED INPUTS ARE EMPTY (IF YES IT MEANS THERE WAS A SCRIPT TAG)
    if (!sanitizedNewValue) {
      return res.status(400).json({ message: "vorbiddenInput" });
    }

    // SANITIZE INPUT STEP 2
    sanitizedNewValue = sanitizedNewValue.trim().toUpperCase();

    const query = `UPDATE users SET ${fieldToEdit} = ? WHERE id = ?`;
    const result = await pool.query(query, [sanitizedNewValue, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "canNotUpdate" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};
