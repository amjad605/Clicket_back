"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("./users.model"));
const AppError_1 = require("../utils/AppError");
class UsersService {
    constructor() { }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findById(userId).select("-password");
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            return user;
        });
    }
    getUsers(excludeUserId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const users = yield users_model_1.default.find({ _id: { $ne: excludeUserId } })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            if (!users) {
                throw new AppError_1.AppError("No users found", 404);
            }
            const totalCount = yield users_model_1.default.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            return { users, totalPages };
        });
    }
    updateUser(userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findById(userId);
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            user.isAdmin = isAdmin;
            yield user.save();
            return user;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findById(userId);
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            yield user.deleteOne();
        });
    }
}
exports.default = new UsersService();
