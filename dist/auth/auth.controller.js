"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
const auth_service_1 = __importDefault(require("./auth.service"));
const generateToken_1 = require("../utils/generateToken");
class AuthController {
    constructor() {
        this.signup = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const user = req.body;
            const createdUser = (await this.authService.signup(user));
            const token = (0, generateToken_1.generateTokenAndSetCookie)(createdUser._id, res);
            res.status(200).json({
                message: "User created successfully",
                user: createdUser,
                token,
            });
        });
        this.login = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { email, password } = req.body;
            const user = (await this.authService.login(email, password));
            const token = (0, generateToken_1.generateTokenAndSetCookie)(user._id, res);
            return res.status(200).json({
                message: "User logged in successfully",
                user,
                token,
            });
        });
        this.logout = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                path: "/",
            });
            res.clearCookie("jwt");
            return res.status(200).json({
                message: "User logged out successfully",
            });
        });
        this.getMe = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(400).json({
                    message: "login to get your profile",
                });
            }
            const user = await this.authService.getMe(userId);
            return res.status(200).json(user);
        });
        this.authService = auth_service_1.default;
    }
}
exports.default = new AuthController();
