"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("./users.service"));
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
class UserController {
    constructor() {
        this.getProfile = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return res.status(400).json({
                    message: "login to get your profile",
                });
            }
            const user = await this.usersService.getProfile(userId);
            res.status(200).json({
                message: "User fetched successfully",
                user,
            });
        });
        this.getUsers = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const excludeUserId = req.params.id;
            const { page, limit } = req.query;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const { users, totalPages } = await this.usersService.getUsers(excludeUserId, pageNumber, limitNumber);
            res.status(200).json({
                message: "Users fetched successfully",
                users,
                totalPages,
            });
        });
        this.updateUser = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const userId = req.params.id;
            const { isAdmin } = req.body;
            const user = await this.usersService.updateUser(userId, isAdmin);
            res.status(200).json({
                message: "User updated successfully",
                user,
            });
        });
        this.deleteUser = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const userId = req.params.id;
            await this.usersService.deleteUser(userId);
            res.status(200).json({
                message: "User deleted successfully",
            });
        });
        this.usersService = users_service_1.default;
    }
}
exports.default = new UserController();
