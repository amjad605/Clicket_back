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
const bookings_service_1 = __importDefault(require("./bookings.service"));
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
class BookingsController {
    constructor() {
        this.createBooking = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const eventId = req.params.eventId;
            const userId = req.user._id;
            console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            if (!userId) {
                return res.status(400).json({
                    message: "login to create a booking",
                });
            }
            const createdBooking = yield this.bookingsService.createBooking(userId, eventId);
            res.status(201).json({
                message: "Booking created successfully",
                booking: createdBooking,
            });
        }));
        this.getAllBooking = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.bookingsService.getAllBookings();
            res.status(200).json({
                message: "Bookings fetched successfully",
                bookings,
            });
        }));
        this.bookingsService = bookings_service_1.default;
    }
}
exports.default = new BookingsController();
