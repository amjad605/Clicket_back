"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const protect_1 = require("../utils/protect");
const authRouter = (0, express_1.Router)();
authRouter.get("/me", protect_1.protect, auth_controller_1.default.getMe);
authRouter.post("/signup", auth_controller_1.default.signup);
authRouter.post("/login", auth_controller_1.default.login);
authRouter.post("/logout", auth_controller_1.default.logout);
exports.default = authRouter;
