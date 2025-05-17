"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./users.controller"));
const usersRouter = (0, express_1.Router)();
usersRouter.get("/", users_controller_1.default.getUsers);
usersRouter.get("/profile", users_controller_1.default.getProfile);
usersRouter.put("/:id", users_controller_1.default.updateUser);
usersRouter.delete("/:id", users_controller_1.default.deleteUser);
exports.default = usersRouter;
