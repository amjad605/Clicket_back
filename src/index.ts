import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/GlobalErrorHandler";
import cookieParser from "cookie-parser";
import appRouter from "./appRouter";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const corsOptions = {
  origin: [
    "https://clicket-front.vercel.app",
    "http://localhost:5173",
    "https://clicket-front-pbua-40d3si6k1-amjad605s-projects.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DB connection
mongoose
  .connect(process.env.DB_URL || "", { maxPoolSize: 10 })
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database error:", err));

// Routes
app.use(appRouter);

// 404 handler

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
