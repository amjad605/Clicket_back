"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
}, { timestamps: true });
const Event = (0, mongoose_1.model)("Event", eventSchema);
exports.default = Event;
