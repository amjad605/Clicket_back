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
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
const events_service_1 = __importDefault(require("./events.service"));
class EventsController {
    constructor() {
        this.getAllEvents = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = req.query;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const { events, totalPages } = yield this.eventsService.getAllEvents(pageNumber, limitNumber);
            res.status(200).json({
                message: "Events fetched successfully",
                events,
                totalPages,
            });
        }));
        this.getEventById = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const event = yield this.eventsService.getEventById(id);
            console.log(event);
            res.status(200).json({
                message: "Event fetched successfully",
                event,
            });
        }));
        this.createEvent = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const event = req.body;
            const createdEvent = yield this.eventsService.createEvent(event);
            res.status(201).json({
                message: "Event created successfully",
                event: createdEvent,
            });
        }));
        this.updateEvent = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const event = req.body;
            const updatedEvent = yield this.eventsService.updateEvent(id, event);
            res.status(200).json({
                message: "Event updated successfully",
                event: updatedEvent,
            });
        }));
        this.deleteEvent = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deletedEvent = yield this.eventsService.deleteEvent(id);
            res.status(200).json({
                message: "Event deleted successfully",
                event: deletedEvent,
            });
        }));
        this.getEventsByCategory = (0, AsyncWrapper_1.AsyncWrapper)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { category, limit, page } = req.params;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const { events, totalPages } = yield this.eventsService.getEventsByCategory(category, pageNumber, limitNumber);
            res.status(200).json({
                message: "Events fetched successfully",
                events,
                totalPages,
            });
        }));
        this.eventsService = events_service_1.default;
    }
}
exports.default = new EventsController();
