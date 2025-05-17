export type bookingType = {
  userId: string;
  eventId: string;
};
export type bookingReturnType = {
  _id: string;
  userId: string;
  eventId: string;
  bookedAt: Date;
};
