import express from "express";
import { getUserId } from "../controllers/user/getUserId.js";
import { updateUser } from "../controllers/user/updateUser.js";
import { getUserAccountInfo } from "../controllers/user/getUserAccountInfo.js";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.js";

export const userRouter = express.Router();

// USER
userRouter
  .route("/")
  .get(authenticationMiddleware, getUserId)
  .patch(authenticationMiddleware, updateUser);

// USER ACCOUNT INFO
userRouter
  .route("/accountInfo")
  .get(authenticationMiddleware, getUserAccountInfo);
