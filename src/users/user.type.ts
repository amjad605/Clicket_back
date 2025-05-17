import { Types } from "mongoose";
export type userType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  bookedEvents: string[] | undefined;
};
export interface UserReturnType extends userType {
  _id: string;

  createdAt?: Date;
  updatedAt?: Date;
}
