"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = __importDefault(require("../users/users.model"));
const protect = async (req, res, next) => {
    var _a;
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token && ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt)) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.status(401).json({ error: "Not authorized, token missing" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 5. Find user
        const user = await users_model_1.default.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "No user found with this ID" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token. Not authorized." });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.protect = protect;
