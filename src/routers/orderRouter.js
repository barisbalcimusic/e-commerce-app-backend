import express from "express";
import { postOrder } from "../controllers/orders/postOrder.js";

export const orderRouter = express.Router();

// ORDERS
orderRouter.route("/orders").post(postOrder);
