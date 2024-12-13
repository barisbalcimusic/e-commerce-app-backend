import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const site_secret = process.env.RECAPTCHA_SITE_SECRET;

export const captchaMiddleware = async (req, res, next) => {
  try {
    const { recaptchaValue } = req.body;

    if (!recaptchaValue) {
      return res.status(400).json({ message: "missingCaptcha" });
    }

    //CHECK IF CAPTCHA VALUE IS VALID
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${site_secret}&response=${recaptchaValue}`
    );

    if (!data.success) {
      return res.status(400).json({ message: "invalidCaptcha" });
    }
    next();
  } catch (e) {
    next(e);
  }
};
