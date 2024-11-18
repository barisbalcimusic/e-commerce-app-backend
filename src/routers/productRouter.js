import express from "express";
import { deleteAllProducts } from "../controllers/products/deleteAllProducts.js";
import { getSingleProduct } from "../controllers/products/getSingleProduct.js";
import { getDetailsOfProduct } from "../controllers/products/getDetailsOfProduct.js";
import { getCollections } from "../controllers/products/getCollections.js";
import { getFilteredProducts } from "../controllers/products/getFilteredProducts.js";
import { getFilters } from "../controllers/products/getFilters.js";
import { getFilteredCount } from "../controllers/products/getFilteredCount.js";

export const productRouter = express.Router();

// ALL PRODUCTS
productRouter.route("/").get(getFilteredProducts).delete(deleteAllProducts);

// FILTERS
productRouter.route("/filters").get(getFilters);

// COUNT PRODUCTS BASED ON FILTERS
productRouter.route("/filteredCount").post(getFilteredCount);

// SINGLE PRODUCT
productRouter.route("/:id").get(getSingleProduct);

// COLLECTIONS
productRouter.route("/collections/:collection").get(getCollections);

// DETAILS OF A SINGLE PRODUCT (DYNAMIC)
productRouter.route("/:id/:detail").get(getDetailsOfProduct);
