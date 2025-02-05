import express from "express";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { sendMessageToAI } from "../controllers/customerSupport/sendMessageToAI";

export const customerSupportRouter = express.Router();

// SEND USER MESSAGES TO AI
customerSupportRouter
  .route("/customerSupport")
  .post(authenticationMiddleware, sendMessageToAI);
