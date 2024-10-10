import express from "express";
import { deleteAllUsers } from "../controllers/user/deleteAllUsers.js";
import { getSingleUser } from "../controllers/user/getSingleUser.js";
import { deleteSingleUser } from "../controllers/user/deleteSingleUser.js";
import { updateUser } from "../controllers/user/updateUser.js";

export const userRouter = express.Router();

// USER
userRouter
  .route("/user")
  .get(getSingleUser)
  .delete(deleteSingleUser)
  .patch(updateUser);

// ONLY FOR TESTING
userRouter.route("/user/deleteAllUsers").delete(deleteAllUsers);
