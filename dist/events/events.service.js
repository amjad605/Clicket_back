"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_model_1 = __importDefault(require("./events.model"));
const AppError_1 = require("../utils/AppError");
const cloudinary_1 = require("cloudinary");
class EventsService {
    constructor() { }
    async getAllEvents(page, limit) {
        const skip = (page - 1) * limit;
        const events = await events_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (!events) {
            throw new AppError_1.AppError("Failed to fetch events", 500);
        }
        const totalCount = await events_model_1.default.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        return { events, totalPages };
    }
    async getEventsByCategory(category, page, limit) {
        const skip = (page - 1) * limit;
        const events = await events_model_1.default.find({ category })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (!events) {
            throw new AppError_1.AppError("Failed to fetch events", 500);
        }
        const totalCount = await events_model_1.default.countDocuments({ category });
        const totalPages = Math.ceil(totalCount / limit);
        return { events, totalPages };
    }
    async getEventById(id) {
        const event = await events_model_1.default.findById(id);
        if (!event) {
            throw new AppError_1.AppError("Event not found", 404);
        }
        return event;
    }
    async createEvent(event) {
        let imageUrl = null;
        // 1. Validate and upload image
        if (event.image && event.image.startsWith("data:image/")) {
            try {
                const uploadResult = await cloudinary_1.v2.uploader.upload(event.image, {
                    allowed_formats: ["jpg", "png", "webp"],
                });
                imageUrl = uploadResult.secure_url;
                console.log("Cloudinary success:", imageUrl);
            }
            catch (err) {
                console.error("Cloudinary error:", err);
                throw new AppError_1.AppError("Failed to upload image", 500);
            }
        }
        const newEvent = new events_model_1.default({ ...event, image: imageUrl });
        await newEvent.save();
        return newEvent;
    }
    async updateEvent(id, event) {
        const updatedEvent = await events_model_1.default.findByIdAndUpdate(id, event, {
            new: true,
        });
        if (!updatedEvent) {
            throw new AppError_1.AppError("Failed to update event", 500);
        }
        return updatedEvent;
    }
    async deleteEvent(id) {
        const event = await events_model_1.default.findById(id);
        if (!event) {
            throw new AppError_1.AppError("Event not found", 404);
        }
        if (event.image) {
            const imgId = event.image.split("/").slice(-1)[0].split(".")[0];
            await cloudinary_1.v2.uploader.destroy(imgId);
        }
        const deletedEvent = await events_model_1.default.findByIdAndDelete(id);
        if (!deletedEvent) {
            throw new AppError_1.AppError("Failed to delete event", 500);
        }
        return deletedEvent;
    }
}
exports.default = new EventsService();
