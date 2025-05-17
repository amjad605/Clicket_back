"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = __importDefault(require("./events.controller"));
const protect_1 = require("../utils/protect");
const AdminOnly_1 = require("../utils/AdminOnly");
const eventsRouter = (0, express_1.Router)();
eventsRouter.get("/id/:id", events_controller_1.default.getEventById);
eventsRouter.get("/", events_controller_1.default.getAllEvents);
eventsRouter.get("/category/:category", events_controller_1.default.getEventsByCategory);
eventsRouter.post("/", protect_1.protect, AdminOnly_1.adminOnly, events_controller_1.default.createEvent);
eventsRouter.put("/:id", events_controller_1.default.updateEvent);
eventsRouter.delete("/:id", events_controller_1.default.deleteEvent);
exports.default = eventsRouter;
