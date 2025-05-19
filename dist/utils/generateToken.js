"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenAndSetCookie = (id, res) => {
    try {
        const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
        });
        return token;
    }
    catch (error) {
        console.error("Error generating token:", error);
        return undefined;
    }
};
exports.generateTokenAndSetCookie = generateTokenAndSetCookie;
