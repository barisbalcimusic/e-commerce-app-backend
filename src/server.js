import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter.js";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({ path: "../.env" });
const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(cookieParser());

// ROUTES
app.use("/", userRouter);
app.use(errorMiddleware);

// SERVER
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
});
