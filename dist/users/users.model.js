"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    bookedEvents: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Event",
        },
    ],
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
