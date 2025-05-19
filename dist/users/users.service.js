"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("./users.model"));
const AppError_1 = require("../utils/AppError");
class UsersService {
    constructor() { }
    async getProfile(userId) {
        const user = await users_model_1.default.findById(userId).select("-password");
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
    async getUsers(excludeUserId, page, limit) {
        const skip = (page - 1) * limit;
        const users = await users_model_1.default.find({ _id: { $ne: excludeUserId } })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (!users) {
            throw new AppError_1.AppError("No users found", 404);
        }
        const totalCount = await users_model_1.default.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        return { users, totalPages };
    }
    async updateUser(userId, isAdmin) {
        const user = await users_model_1.default.findById(userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        user.isAdmin = isAdmin;
        await user.save();
        return user;
    }
    async deleteUser(userId) {
        const user = await users_model_1.default.findById(userId);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        await user.deleteOne();
    }
}
exports.default = new UsersService();
