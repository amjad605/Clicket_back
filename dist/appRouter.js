"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth/auth.router"));
const events_router_1 = __importDefault(require("./events/events.router"));
const protect_1 = require("./utils/protect");
const users_router_1 = __importDefault(require("./users/users.router"));
const bookings_router_1 = __importDefault(require("./bookings/bookings.router"));
const appRouter = (0, express_1.Router)();
appRouter.use("/auth", auth_router_1.default);
appRouter.use("/events", events_router_1.default);
appRouter.use("/users", protect_1.protect, users_router_1.default);
appRouter.use("/bookings", protect_1.protect, bookings_router_1.default);
exports.default = appRouter;
