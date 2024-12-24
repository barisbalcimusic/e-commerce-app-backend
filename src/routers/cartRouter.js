import express from "express";
import { updateProductsInCart } from "../controllers/cart/updateProductsInCart.js";
import { getProductsFromCart } from "../controllers/cart/getProductsFromCart.js";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.js";

export const cartRouter = express.Router();

// UPDATE PRODUCTS IN CART OR GET PRODUCTS FROM CART
cartRouter
  .route("/")
  .post(authenticationMiddleware, updateProductsInCart)
  .get(authenticationMiddleware, getProductsFromCart);
