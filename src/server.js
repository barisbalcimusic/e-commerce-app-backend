import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appRouter } from "./routers/appRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

dotenv.config({ path: "../.env" });
const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;
const clientURL =
  nodeEnv === "prod" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

app.use(
  cors({
    origin: clientURL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

// ROUTES
app.use("/", appRouter);
app.use(errorMiddleware);

// SERVER
app.listen(port, "0.0.0.0", async () => {
  console.log(`Server listening on port ${port}`);
});
