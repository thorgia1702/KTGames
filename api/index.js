import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import itemRouter from "./routes/item.route.js";
import cookieParser from "cookie-parser";
import { createDefaultAdmin } from "./controllers/auth.controller.js";
import { createServer } from "http";
import initSocketIo from "./utils/initSocketIo.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/item", itemRouter);

// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const httpServer = createServer(app);
initSocketIo(httpServer);

createDefaultAdmin()
  .then(() => {
    console.log("Default admin account already exists!");
  })
  .catch((error) => {
    console.error("Error creating default admin account:", error);
  });

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
