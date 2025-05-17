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
const users_model_1 = __importDefault(require("../users/users.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../utils/AppError");
class AuthService {
    constructor() { }
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield users_model_1.default.findOne({ email: user.email });
            if (existingUser) {
                throw new AppError_1.AppError("User already exists", 400);
            }
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            const newUser = new users_model_1.default(Object.assign(Object.assign({}, user), { password: hashedPassword }));
            if (!newUser) {
                throw new AppError_1.AppError("Failed to create user", 500);
            }
            yield newUser.save();
            return newUser;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ email: email });
            if (!user) {
                throw new AppError_1.AppError("Wrong Credentials", 400);
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isValidPassword) {
                throw new AppError_1.AppError("Wrong Credentials", 400);
            }
            return user;
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findById(userId).select("-password");
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            return user;
        });
    }
}
exports.default = new AuthService();
//
