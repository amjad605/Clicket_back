"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncWrapper_1 = require("../utils/AsyncWrapper");
const events_service_1 = __importDefault(require("./events.service"));
class EventsController {
    constructor() {
        this.getAllEvents = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { page, limit } = req.query;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const { events, totalPages } = await this.eventsService.getAllEvents(pageNumber, limitNumber);
            res.status(200).json({
                message: "Events fetched successfully",
                events,
                totalPages,
            });
        });
        this.getEventById = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { id } = req.params;
            const event = await this.eventsService.getEventById(id);
            console.log(event);
            res.status(200).json({
                message: "Event fetched successfully",
                event,
            });
        });
        this.createEvent = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const event = req.body;
            const createdEvent = await this.eventsService.createEvent(event);
            res.status(201).json({
                message: "Event created successfully",
                event: createdEvent,
            });
        });
        this.updateEvent = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { id } = req.params;
            const event = req.body;
            const updatedEvent = await this.eventsService.updateEvent(id, event);
            res.status(200).json({
                message: "Event updated successfully",
                event: updatedEvent,
            });
        });
        this.deleteEvent = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { id } = req.params;
            const deletedEvent = await this.eventsService.deleteEvent(id);
            res.status(200).json({
                message: "Event deleted successfully",
                event: deletedEvent,
            });
        });
        this.getEventsByCategory = (0, AsyncWrapper_1.AsyncWrapper)(async (req, res, next) => {
            const { category, limit, page } = req.params;
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const { events, totalPages } = await this.eventsService.getEventsByCategory(category, pageNumber, limitNumber);
            res.status(200).json({
                message: "Events fetched successfully",
                events,
                totalPages,
            });
        });
        this.eventsService = events_service_1.default;
    }
}
exports.default = new EventsController();
