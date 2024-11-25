import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appRouter } from "./routers/appRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

dotenv.config({ path: "../.env" });
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(cookieParser());

// ROUTES
app.use("/", appRouter);
app.use(errorMiddleware);

// SERVER
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
});
