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
const users_model_1 = __importDefault(require("../users/users.model"));
const bookings_model_1 = __importDefault(require("./bookings.model"));
const events_model_1 = __importDefault(require("../events/events.model"));
const AppError_1 = require("../utils/AppError");
class BookingsService {
    constructor() { }
    createBooking(userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findById(userId);
            const event = yield events_model_1.default.findById(eventId);
            if (!user) {
                throw new AppError_1.AppError("User not found", 404);
            }
            if (!event) {
                throw new AppError_1.AppError("Event not found", 404);
            }
            const alreadyBooked = yield bookings_model_1.default.findOne({
                userId: user._id,
                eventId: event._id,
            });
            if (alreadyBooked) {
                throw new AppError_1.AppError("User already booked this event", 400);
            }
            const newBooking = new bookings_model_1.default({
                userId: user._id,
                eventId: event._id,
                bookedAt: new Date(),
            });
            if (!newBooking) {
                throw new AppError_1.AppError("Failed to create booking", 500);
            }
            user.bookedEvents.push(event._id);
            yield user.save();
            yield newBooking.save();
            return newBooking;
        });
    }
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookings_model_1.default.find()
                .populate("userId")
                .populate("eventId");
            if (!bookings) {
                throw new AppError_1.AppError("Failed to fetch bookings", 500);
            }
            return bookings.map((booking) => {
                const user = booking.userId instanceof users_model_1.default
                    ? booking.userId
                    : null;
                if (!user) {
                    throw new AppError_1.AppError("Failed to fetch user details for booking", 500);
                }
                const event = booking.eventId instanceof events_model_1.default
                    ? booking.eventId
                    : null;
                if (!event) {
                    throw new AppError_1.AppError("Failed to fetch event details for booking", 500);
                }
                return {
                    _id: booking._id,
                    userId: user._id,
                    eventId: event._id,
                    bookedAt: booking.bookedAt,
                    userName: user.firstName + " " + user.lastName,
                    eventName: event.name,
                };
            });
        });
    }
}
exports.default = new BookingsService();
