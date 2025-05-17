export type EventType = {
  name: string;
  description: string;
  category: string;
  date: Date;
  venue: string;
  price: number;
  image: string | null;
};
export interface EventReturnType extends EventType {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
