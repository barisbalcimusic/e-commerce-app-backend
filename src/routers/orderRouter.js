import express from "express";
import { postOrder } from "../controllers/orders/postOrder.js";
import { getOrdersByUser } from "../controllers/orders/getOrdersByUser.js";
import { getProductsByOrder } from "../controllers/orders/getProductsByOrder.js";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.js";

export const orderRouter = express.Router();

// GET ORDER DETAILS
orderRouter.route("/details").get(authenticationMiddleware, getProductsByOrder);

// GET ORDER SUMMARY
orderRouter
  .route("/")
  .get(authenticationMiddleware, getOrdersByUser)
  .post(authenticationMiddleware, postOrder);
