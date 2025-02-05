import express from "express";
import { userRouter } from "./userRouter.js";
import { productRouter } from "./productRouter.js";
import { orderRouter } from "./orderRouter.js";
import { authRouter } from "./authRouter.js";
import { cartRouter } from "./cartRouter.js";
import { customerSupportRouter } from "./customerSupportRouter.js";

export const appRouter = express.Router();

appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
appRouter.use("/products", productRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/orders", orderRouter);
appRouter.use("/customerSupport", customerSupportRouter);
