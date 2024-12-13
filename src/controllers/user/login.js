import { configDotenv } from "dotenv";
import { pool } from "../../utils/config/DBconfig.js";
import { comparePasswords } from "../../utils/crypto.js";
import { generateaccessToken } from "../../utils/jwt.js";

configDotenv();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "missingInput" });
    }

    const [[user]] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user) {
      return res.status(404).json({ message: "userNotFound" });
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalidCredentials" });
    }

    if (!accessTokenSecret) {
      return res.status(500).json({ message: "accessTokenSecretNotFound" });
    }

    const accessToken = generateaccessToken(user.id, accessTokenSecret);

    if (!accessToken) {
      return res.status(500).json({ message: "accessTokenCreateError" });
    }

    // SET ACCESS TOKEN IN COOKIE
    res.cookie("accessToken", accessToken, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: "None",
      //! ONLY FOR TESTING
      secure: true,
    });

    res.status(200).json({
      message: "success",
      data: {
        id: user.user_id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    next(error);
  }
};
