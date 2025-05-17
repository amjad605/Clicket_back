"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = __importDefault(require("./bookings.controller"));
const bookingRouter = (0, express_1.Router)();
bookingRouter.get("/", bookings_controller_1.default.getAllBooking);
bookingRouter.post("/:eventId", bookings_controller_1.default.createBooking);
exports.default = bookingRouter;
