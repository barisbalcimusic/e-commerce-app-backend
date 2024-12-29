import { pool } from "../../utils/config/DBconfig.js";
import { compareFunc } from "../../utils/crypto.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { userId, token } = req.query;

    if (!userId || !token) {
      return res.status(401).json({
        message: "missingIdorToken",
      });
    }

    const [result] = await pool.query(
      "SELECT verification_token FROM users WHERE id = ?",
      [userId]
    );

    const hashedToken = result[0].verification_token;

    if (!hashedToken) {
      return res.status(401).json({
        message: "missingTokenOrUserInDB",
      });
    }

    //  COMPARE PASSWORD HASHES
    const isTokenValid = await compareFunc(token, hashedToken);

    if (!isTokenValid) {
      return res.status(401).json({
        message: "invalidToken",
      });
    }

    //  UPDATE USER'S VERIFICATION STATUS
    const [updateResult] = await pool.query(
      "UPDATE users SET is_verified = 1 WHERE id = ?",
      [userId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(401).json({
        message: "verifyUpdateFailed",
      });
    }

    //RETURN A SUCCESS MESSAGE
    res.status(200).redirect("https://btw.barisbalci.de/login");
  } catch (e) {
    next(e);
  }
};
