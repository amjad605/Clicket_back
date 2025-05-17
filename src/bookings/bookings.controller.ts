import bookingsService from "./bookings.service";
import { AsyncWrapper } from "../utils/AsyncWrapper";
import { Request, Response, NextFunction } from "express";
import { bookingType } from "./bookings.type";
class BookingsController {
  private bookingsService;
  constructor() {
    this.bookingsService = bookingsService;
  }
  createBooking = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const eventId: string = req.params.eventId;
      const userId: string | undefined = req.user!._id;
      console.log(req.user?._id);
      if (!userId) {
        return res.status(400).json({
          message: "login to create a booking",
        });
      }

      const createdBooking = await this.bookingsService.createBooking(
        userId,
        eventId
      );
      res.status(201).json({
        message: "Booking created successfully",
        booking: createdBooking,
      });
    }
  );
  getAllBooking = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const bookings = await this.bookingsService.getAllBookings();
      res.status(200).json({
        message: "Bookings fetched successfully",
        bookings,
      });
    }
  );
}
export default new BookingsController();
