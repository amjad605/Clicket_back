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
const allowedOrigins = [
  "https://clicket-front.vercel.app",
  "http://localhost:5173",
  /\.vercel\.app$/, // All Vercel preview deployments
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.some((pattern) => {
        if (typeof pattern === "string") return origin === pattern;
        return pattern.test(origin);
      })
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: [
    "Set-Cookie",
    "Authorization",
    "authorization",
    "Content-Length",
  ],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));
app.options("*", cors());

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
app.all("*", (req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint not found" });
});

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
