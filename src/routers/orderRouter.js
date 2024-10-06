import express from "express";
import { postOrder } from "../controllers/orders/postOrder.js";
import { getOrdersByUser } from "../controllers/orders/getOrdersByUser.js";
import { getProductsByOrder } from "../controllers/orders/getProductsByOrder.js";

export const orderRouter = express.Router();

// ORDERS
orderRouter.route("/").get(getOrdersByUser).post(postOrder);
orderRouter.route("/:id").get(getProductsByOrder);
    