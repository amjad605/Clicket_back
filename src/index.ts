import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/GlobalErrorHandler";
import cookieParser from "cookie-parser";
import appRouter from "./appRouter";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
const app = express();
app.use(cookieParser());
cloudinary.config({
  cloud_name: "dft8tywhd",
  api_key: "844332542647854",
  api_secret: "LlQ8lHsrgf8f3xs74iH_bdlJlfo", // Click 'View API Keys' above to copy your API secret
});

dotenv.config();
app.use(express.json({ limit: "5mb" }));
mongoose
  .connect(process.env.DB_URL || "", {
    maxPoolSize: 10,
  })
  .then(() => {
    console.log("Connected to database");
  });
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(appRouter);

app.use(globalErrorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
