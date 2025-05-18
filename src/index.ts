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

// 1. CORS Configuration (MUST come first)
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

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler for all routes
app.options("*", cors(corsOptions));

// 2. Other Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Database Connection
mongoose
  .connect(process.env.DB_URL || "", { maxPoolSize: 10 })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

// 4. Routes
app.use(appRouter);

// 5. 404 Handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
  });
});

// 6. Global Error Handler
app.use(globalErrorHandler);

// Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Allowed CORS origins: ${allowedOrigins
      .map((o) => o.toString())
      .join(", ")}`
  );
});
