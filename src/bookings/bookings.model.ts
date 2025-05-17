import { Schema, model, Document, Types } from "mongoose";

interface IBooking extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  bookedAt: Date | null;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    eventId: { type: Schema.Types.ObjectId, required: true, ref: "Event" },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
