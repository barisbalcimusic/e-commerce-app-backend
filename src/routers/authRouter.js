import express from "express";
import { register } from "../controllers/user/register.js";
import { login } from "../controllers/user/login.js";
import { logout } from "../controllers/user/logout.js";

export const authRouter = express.Router();

// AUTH
authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
