import Event from "./events.model";
import { AppError } from "../utils/AppError";
import { EventType } from "./events.type";
import { v2 as cloudinary } from "cloudinary";
class EventsService {
  constructor() {}
  async getAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const events = await Event.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!events) {
      throw new AppError("Failed to fetch events", 500);
    }
    const totalCount = await Event.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    return { events, totalPages };
  }
  async getEventsByCategory(category: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const events = await Event.find({ category })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!events) {
      throw new AppError("Failed to fetch events", 500);
    }
    const totalCount = await Event.countDocuments({ category });
    const totalPages = Math.ceil(totalCount / limit);
    return { events, totalPages };
  }
  async getEventById(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    return event;
  }
  async createEvent(event: EventType) {
    let imageUrl = null;

    // 1. Validate and upload image
    if (event.image && event.image.startsWith("data:image/")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(event.image, {
          allowed_formats: ["jpg", "png", "webp"],
        });
        imageUrl = uploadResult.secure_url;
        console.log("Cloudinary success:", imageUrl);
      } catch (err) {
        console.error("Cloudinary error:", err);
        throw new AppError("Failed to upload image", 500);
      }
    }

    const newEvent = new Event({ ...event, image: imageUrl });
    await newEvent.save();

    return newEvent;
  }
  async updateEvent(id: string, event: EventType) {
    const updatedEvent = await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
    if (!updatedEvent) {
      throw new AppError("Failed to update event", 500);
    }
    return updatedEvent;
  }
  async deleteEvent(id: string) {
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    if (event.image) {
      const imgId = event.image.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      throw new AppError("Failed to delete event", 500);
    }
    return deletedEvent;
  }
}
export default new EventsService();
