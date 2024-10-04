import express from "express";
import { getAllProducts } from "../controllers/products/getAllProducts.js";
import { deleteAllProducts } from "../controllers/products/deleteAllProducts.js";

export const productRouter = express.Router();

// PRODUCTS
productRouter.route("/").get(getAllProducts).delete(deleteAllProducts);
