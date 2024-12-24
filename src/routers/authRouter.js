import express from "express";
import { register } from "../controllers/user/register.js";
import { login } from "../controllers/user/login.js";
import { logout } from "../controllers/user/logout.js";
import { captchaMiddleware } from "../middlewares/captchaMiddleware.js";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.js";
import { createUserCart } from "../controllers/cart/createUserCart.js";

export const authRouter = express.Router();

// REGISTER & CREATE USER CART
authRouter
  .route("/register")
  .post(captchaMiddleware, register, createUserCart, async (req, res, next) => {
    res.status(200).json({ message: "success" });
  });

// LOGIN
authRouter.route("/login").post(login);

// LOGOUT
authRouter.route("/logout").post(authenticationMiddleware, logout);

// AUTHENTICATE USER (FOR CASES LIKE PAGE REFRESH OR COOKIE EXPIRATION)
authRouter
  .route("/authentication")
  .get(authenticationMiddleware, async (req, res, next) => {
    res.status(200).json({ isValid: true });
  });
