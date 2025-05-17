"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Event" },
    bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Booking = (0, mongoose_1.model)("Booking", bookingSchema);
exports.default = Booking;
