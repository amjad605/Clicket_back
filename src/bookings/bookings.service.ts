import User from "../users/users.model";
import Booking from "./bookings.model";
import { bookingType } from "./bookings.type";
import Event from "../events/events.model";
import { AppError } from "../utils/AppError";
import { UserReturnType } from "../users/user.type";
import { EventReturnType } from "../events/events.type";
import { Types } from "mongoose";

class BookingsService {
  constructor() {}
  async createBooking(userId: string, eventId: string) {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    const alreadyBooked = await Booking.findOne({
      userId: user._id,
      eventId: event._id,
    });
    if (alreadyBooked) {
      throw new AppError("User already booked this event", 400);
    }

    const newBooking = new Booking({
      userId: user._id,
      eventId: event._id,
      bookedAt: new Date(),
    });
    if (!newBooking) {
      throw new AppError("Failed to create booking", 500);
    }
    user.bookedEvents!.push(event._id as Types.ObjectId);
    await user.save();
    await newBooking.save();
    return newBooking;
  }
  async getAllBookings() {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("eventId");
    if (!bookings) {
      throw new AppError("Failed to fetch bookings", 500);
    }

    return bookings.map((booking) => {
      const user =
        booking.userId instanceof User
          ? (booking.userId as UserReturnType)
          : null;
      if (!user) {
        throw new AppError("Failed to fetch user details for booking", 500);
      }
      const event =
        booking.eventId instanceof Event
          ? (booking.eventId as EventReturnType)
          : null;
      if (!event) {
        throw new AppError("Failed to fetch event details for booking", 500);
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
  }
}
export default new BookingsService();
