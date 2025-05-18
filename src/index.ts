import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/GlobalErrorHandler";
import cookieParser from "cookie-parser";
import appRouter from "./appRouter";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

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
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((pattern) => {
      if (typeof pattern === "string") return origin === pattern;
      return pattern.test(origin);
    });

    if (isAllowed) {
      console.log("✅ CORS allowed:", origin);
      return callback(null, true);
    }

    console.error("❌ CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database Connection
mongoose
  .connect(process.env.DB_URL || "", { maxPoolSize: 10 })
  .then(() => console.log("✅ Connected to database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Routes
app.use(appRouter);

// 404 Handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `🌐 Allowed CORS origins: ${allowedOrigins
      .map((o) => o.toString())
      .join(", ")}`
  );
});
