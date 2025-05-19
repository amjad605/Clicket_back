"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookings_service_1 = __importDefault(require("./bookings.service"));
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
class BookingsController {
    constructor() {
        this.createBooking = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            var _a;
            const eventId = req.params.eventId;
            const userId = req.user._id;
            console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            if (!userId) {
                return res.status(400).json({
                    message: "login to create a booking",
                });
            }
            const createdBooking = await this.bookingsService.createBooking(userId, eventId);
            res.status(201).json({
                message: "Booking created successfully",
                booking: createdBooking,
            });
        });
        this.getAllBooking = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const bookings = await this.bookingsService.getAllBookings();
            res.status(200).json({
                message: "Bookings fetched successfully",
                bookings,
            });
        });
        this.bookingsService = bookings_service_1.default;
    }
}
exports.default = new BookingsController();
