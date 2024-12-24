import dotenv from "dotenv";
import { verifyAccessToken } from "../../utils/jwt.js";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const getUserId = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verifyAccessToken(token, accessTokenSecret);
    res.json({ id: decoded.userId });
  } catch (error) {
    next(error);
  }
};
