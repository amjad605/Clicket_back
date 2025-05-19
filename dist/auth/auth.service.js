"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../users/users.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../utils/AppError");
class AuthService {
    constructor() { }
    async signup(user) {
        const existingUser = await users_model_1.default.findOne({ email: user.email });
        if (existingUser) {
            throw new AppError_1.AppError("User already exists", 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        const newUser = new users_model_1.default({
            ...user,
            password: hashedPassword,
        });
        if (!newUser) {
            throw new AppError_1.AppError("Failed to create user", 500);
        }
        await newUser.save();
        return newUser;
    }
    async login(email, password) {
        const user = await users_model_1.default.findOne({ email: email });
        if (!user) {
            throw new AppError_1.AppError("Wrong Credentials", 400);
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new AppError_1.AppError("Wrong Credentials", 400);
        }
        return user;
    }
    async getMe(userId) {
        const user = await users_model_1.default.findById(userId).select("-password");
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
}
exports.default = new AuthService();
//
