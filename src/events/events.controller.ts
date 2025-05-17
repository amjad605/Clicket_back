import e from "cors";
import { AsyncWrapper } from "../utils/AsyncWrapper";
import eventsService from "./events.service";
import { EventType } from "./events.type";
class EventsController {
  private eventsService;

  constructor() {
    this.eventsService = eventsService;
  }
  getAllEvents = AsyncWrapper(async (req, res, next) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    const { events, totalPages } = await this.eventsService.getAllEvents(
      pageNumber,
      limitNumber
    );
    res.status(200).json({
      message: "Events fetched successfully",
      events,
      totalPages,
    });
  });
  getEventById = AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const event = await this.eventsService.getEventById(id);
    console.log(event);
    res.status(200).json({
      message: "Event fetched successfully",
      event,
    });
  });
  createEvent = AsyncWrapper(async (req, res, next) => {
    const event: EventType = req.body;
    const createdEvent = await this.eventsService.createEvent(event);
    res.status(201).json({
      message: "Event created successfully",
      event: createdEvent,
    });
  });
  updateEvent = AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const event: EventType = req.body;
    const updatedEvent = await this.eventsService.updateEvent(id, event);
    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  });
  deleteEvent = AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedEvent = await this.eventsService.deleteEvent(id);
    res.status(200).json({
      message: "Event deleted successfully",
      event: deletedEvent,
    });
  });
  getEventsByCategory = AsyncWrapper(async (req, res, next) => {
    const { category, limit, page } = req.params;
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    const { events, totalPages } = await this.eventsService.getEventsByCategory(
      category,
      pageNumber,
      limitNumber
    );
    res.status(200).json({
      message: "Events fetched successfully",
      events,
      totalPages,
    });
  });
}
export default new EventsController();
