import { Router } from "express";
import eventsController from "./events.controller";
import { protect } from "../utils/protect";
import { adminOnly } from "../utils/AdminOnly";
const eventsRouter = Router();
eventsRouter.get("/id/:id", eventsController.getEventById);
eventsRouter.get("/", eventsController.getAllEvents);
eventsRouter.get("/category/:category", eventsController.getEventsByCategory);
eventsRouter.post("/", protect, adminOnly, eventsController.createEvent);

eventsRouter.put("/:id", eventsController.updateEvent);
eventsRouter.delete("/:id", eventsController.deleteEvent);
export default eventsRouter;
