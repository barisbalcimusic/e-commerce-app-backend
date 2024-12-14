import express from "express";
import { register } from "../controllers/user/register.js";
import { login } from "../controllers/user/login.js";
import { logout } from "../controllers/user/logout.js";
import { captchaMiddleware } from "../middlewares/captchaMiddleware.js";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.js";

export const authRouter = express.Router();

// AUTH
authRouter.route("/register").post(captchaMiddleware, register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
// VERIFY COOKIE
authRouter
  .route("/verifyCookie")
  .get(authenticationMiddleware, async (req, res, next) => {
    res.status(200).json({ isValid: true });
  });
