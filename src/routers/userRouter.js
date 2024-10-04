import express from "express";
import { deleteAllUsers } from "../controllers/user/deleteAllUsers.js";
import { getSingleUser } from "../controllers/user/getSingleUser.js";

export const userRouter = express.Router();

// USER
userRouter.route("/user").post(getSingleUser);
userRouter.route("/deleteAllUsers").delete(deleteAllUsers);
