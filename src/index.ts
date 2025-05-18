import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/GlobalErrorHandler";
import cookieParser from "cookie-parser";
import appRouter from "./appRouter";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

const app = express();

// 1. CORS should be the very first middleware
const corsOptions = {
  origin: [
    "https://clicket-front.vercel.app",
    "http://localhost:5173",
    "https://clicket-front-pbua-40d3si6k1-amjad605s-projects.vercel.app",
    /\.vercel\.app$/, // regex for all vercel preview deployments
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight for all routes

// 2. Other middlewares
dotenv.config();
app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); // Keep only one express.json()

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
mongoose
  .connect(process.env.DB_URL || "", {
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("Connected to database");
  });

// Routes
app.use(appRouter);

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    data: {
      message: "Endpoint Not found",
    },
  });
});

// Error handler
app.use(globalErrorHandler);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
