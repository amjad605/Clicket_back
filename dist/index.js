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
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express_1.default.json({ limit: "5mb" }));
mongoose_1.default
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(appRouter_1.default);
app.use(GlobalErrorHandler_1.globalErrorHandler);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
