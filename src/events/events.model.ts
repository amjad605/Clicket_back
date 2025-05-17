import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  category: string;
  date: Date;
  venue: string;
  price: number;
  image: string;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Event = model<IEvent>("Event", eventSchema);

export default Event;
