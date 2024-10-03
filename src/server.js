import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter.js";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

dotenv.config({ path: "../.env" });
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", userRouter);
app.use(errorMiddleware);

// SERVER
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
});
