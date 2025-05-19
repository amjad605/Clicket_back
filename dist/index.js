"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const GlobalErrorHandler_1 = require("./utils/GlobalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appRouter_1 = __importDefault(require("./appRouter"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "https://clicket-front.vercel.app",
        "http://localhost:5173",
        "https://clicket-front-pbua-40d3si6k1-amjad605s-projects.vercel.app",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)());
// Middlewares
app.use(express_1.default.json({ limit: "5mb" }));
app.use((0, cookie_parser_1.default)());
// Cloudinary setup
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// DB connection
mongoose_1.default
    .connect(process.env.DB_URL || "", { maxPoolSize: 10 })
    .then(() => console.log("✅ Connected to database"))
    .catch((err) => console.error("❌ Database error:", err));
// Routes
app.use(appRouter_1.default);
// 404 handler
app.all("*", (req, res) => {
    res.status(404).json({ status: "error", message: "Endpoint not found" });
});
// Global error handler
app.use(GlobalErrorHandler_1.globalErrorHandler);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
