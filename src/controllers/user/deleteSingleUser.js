import { pool } from "../../utils/config/DBconfig.js";

export const deleteSingleUser = async (req, res, next) => {
  try {
    const { id } = req.body;

    const query = "DELETE FROM users WHERE user_id = ?";

    await pool.execute(query, [id]);

    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
