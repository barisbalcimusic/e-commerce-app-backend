import express from "express";
import { getSingleProduct } from "../controllers/products/getSingleProduct.js";
import { getFilteredProducts } from "../controllers/products/getFilteredProducts.js";
import { getFilters } from "../controllers/products/getFilters.js";
import { getFilteredCount } from "../controllers/products/getFilteredCount.js";
import { getProductsByTargetGroup } from "../controllers/products/getProductsByTargetGroup.js";
import { getProductsByCategory } from "../controllers/products/getProductsByCategory.js";
import { getProductsByCollection } from "../controllers/products/getProductsByCollection.js";
import { getSearchResultsList } from "../controllers/products/getSearchResultsList.js";
import { getSearchResults } from "../controllers/products/getSearchResults.js";

export const productRouter = express.Router();

// SINGLE PRODUCT
productRouter.route("/singleProduct/:id").get(getSingleProduct);

// FILTERED PRODUCTS
productRouter.route("/filteredProducts").post(getFilteredProducts);

// PRODUCTS BY CATEGORY
productRouter.route("/category").get(getProductsByCategory);

// COLLECTIONS
productRouter.route("/collection").get(getProductsByCollection);

// PRODUCTS BY TARGET GROUP
productRouter.route("/targetGroup").get(getProductsByTargetGroup);

// FILTERS
productRouter.route("/filters").get(getFilters);

// PRODUCT COUNT BASED ON FILTERS
productRouter.route("/filteredCount").post(getFilteredCount);

// SEARCH LIST
productRouter.route("/searchList").get(getSearchResultsList);

// SEARCH RESULTS
productRouter.route("/searchResults").get(getSearchResults);
