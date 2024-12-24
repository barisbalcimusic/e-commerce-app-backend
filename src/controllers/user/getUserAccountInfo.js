import { pool } from "../../utils/config/DBconfig.js";

export const getUserAccountInfo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { requestedFields } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "missingUserId" });
    }

    const [[user]] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!user) {
      return res.status(404).json({ message: "userNotFound" });
    }

    const data = {};
    if (requestedFields) {
      if (Array.isArray(requestedFields)) {
        requestedFields.forEach((field) => {
          data[field] = user[field];
        });
      } else {
        data[requestedFields] = user[requestedFields];
      }
    }

    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
