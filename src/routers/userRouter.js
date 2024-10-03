import express from "express";
import { register } from "../controllers/user/register.js";
import { deleteAllUsers } from "../controllers/user/deleteAllUsers.js";
import { getSingleUser } from "../controllers/user/getSingleUser.js";
import { getAllProducts } from "../controllers/products/getAllProducts.js";
import { deleteAllProducts } from "../controllers/products/deleteAllProducts.js";
import { login } from "../controllers/user/login.js";

export const userRouter = express.Router();

userRouter.route("/products").get(getAllProducts);
userRouter.route("/deleteAllProducts").delete(deleteAllProducts);
userRouter.route("/user").post(getSingleUser);
userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/deleteAllUsers").delete(deleteAllUsers);
