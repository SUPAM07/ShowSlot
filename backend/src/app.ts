import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rootRouter from "./routes"; // Imports from routes/index.ts
import { globalErrorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// 1. Pre-route Middlewares
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.json());

// 2. Health Check / Root Route
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to BookMyScreen API",
  });
});

// 3. Centralized API Routes
// This matches: /api/v1/movies AND /api/v1/theaters
app.use("/api/v1", rootRouter);

// 4. Catch-all for 404s (Routes not found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `The requested path ${req.originalUrl} was not found on this server.`,
  });
});

// 5. Global error handler (MUST be the absolute last thing)
app.use(globalErrorHandler);

export default app;