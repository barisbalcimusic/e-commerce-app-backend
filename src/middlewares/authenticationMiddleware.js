import dotenv from "dotenv";
import { verifyAccessToken } from "../utils/jwt.js";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const authenticationMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "missingAuthToken",
      });
    }

    if (!accessTokenSecret)
      return res.status(500).json({
        message: "envError",
      });

    const verification = verifyAccessToken(token, accessTokenSecret);

    if (!verification) {
      return res.status(401).json({
        message: "tokenVerificationFailed",
      });
    }
    req.user = verification;
    next();
  } catch (err) {
    next(err);
  }
};
