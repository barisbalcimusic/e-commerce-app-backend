import express from "express";
import { sendMessageToAI } from "../controllers/customerSupport/sendMessageToAI.js";

export const customerSupportRouter = express.Router();

// SEND USER MESSAGES TO AI
customerSupportRouter.route("/").post(sendMessageToAI);
