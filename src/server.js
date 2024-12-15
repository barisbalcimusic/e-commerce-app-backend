import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appRouter } from "./routers/appRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

dotenv.config({ path: "../.env" });
const port = process.env.PORT;

app.use(
  cors({
    origin: "https://btw.barisbalci.de",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(cookieParser());

// ROUTES
app.use("/", appRouter);
app.use(errorMiddleware);

// SERVER
app.listen(port, "0.0.0.0", async () => {
  console.log(`Server listening on port ${port}`);
});
