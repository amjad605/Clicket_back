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
const events_model_1 = __importDefault(require("./events.model"));
const AppError_1 = require("../utils/AppError");
const cloudinary_1 = require("cloudinary");
class EventsService {
    constructor() { }
    getAllEvents(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const events = yield events_model_1.default.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            if (!events) {
                throw new AppError_1.AppError("Failed to fetch events", 500);
            }
            const totalCount = yield events_model_1.default.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            return { events, totalPages };
        });
    }
    getEventsByCategory(category, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const events = yield events_model_1.default.find({ category })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            if (!events) {
                throw new AppError_1.AppError("Failed to fetch events", 500);
            }
            const totalCount = yield events_model_1.default.countDocuments({ category });
            const totalPages = Math.ceil(totalCount / limit);
            return { events, totalPages };
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield events_model_1.default.findById(id);
            if (!event) {
                throw new AppError_1.AppError("Event not found", 404);
            }
            return event;
        });
    }
    createEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageUrl = null;
            // 1. Validate and upload image
            if (event.image && event.image.startsWith("data:image/")) {
                try {
                    const uploadResult = yield cloudinary_1.v2.uploader.upload(event.image, {
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
            const newEvent = new events_model_1.default(Object.assign(Object.assign({}, event), { image: imageUrl }));
            yield newEvent.save();
            return newEvent;
        });
    }
    updateEvent(id, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedEvent = yield events_model_1.default.findByIdAndUpdate(id, event, {
                new: true,
            });
            if (!updatedEvent) {
                throw new AppError_1.AppError("Failed to update event", 500);
            }
            return updatedEvent;
        });
    }
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield events_model_1.default.findById(id);
            if (!event) {
                throw new AppError_1.AppError("Event not found", 404);
            }
            if (event.image) {
                const imgId = event.image.split("/").slice(-1)[0].split(".")[0];
                yield cloudinary_1.v2.uploader.destroy(imgId);
            }
            const deletedEvent = yield events_model_1.default.findByIdAndDelete(id);
            if (!deletedEvent) {
                throw new AppError_1.AppError("Failed to delete event", 500);
            }
            return deletedEvent;
        });
    }
}
exports.default = new EventsService();
