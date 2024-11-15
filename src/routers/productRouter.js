import express from "express";
import { getAllProducts } from "../controllers/products/getAllProducts.js";
import { deleteAllProducts } from "../controllers/products/deleteAllProducts.js";
import { getSingleProduct } from "../controllers/products/getSingleProduct.js";
import { getDetailsOfProduct } from "../controllers/products/getDetailsOfProduct.js";

export const productRouter = express.Router();

// ALL PRODUCTS
productRouter.route("/").get(getAllProducts).delete(deleteAllProducts);

// SINGLE PRODUCT
productRouter.route("/:id").get(getSingleProduct);

// DETAILS OF A SINGLE PRODUCT (DYNAMIC)
productRouter.route("/:id/:detail").get(getDetailsOfProduct);
