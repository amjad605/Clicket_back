import { Router } from "express";
import bookingsController from "./bookings.controller";
const bookingRouter = Router();
bookingRouter.get("/", bookingsController.getAllBooking);
bookingRouter.post("/:eventId", bookingsController.createBooking);
export default bookingRouter;
