import { Schema, model, Document, Types } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  bookedEvents: Types.ObjectId[] | undefined;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bookedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
