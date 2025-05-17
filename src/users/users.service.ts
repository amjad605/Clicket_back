import User from "./users.model";
import { AppError } from "../utils/AppError";
import { skip } from "node:test";
class UsersService {
  constructor() {}
  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  async getUsers(excludeUserId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await User.find({ _id: { $ne: excludeUserId } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    if (!users) {
      throw new AppError("No users found", 404);
    }
    const totalCount = await User.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    return { users, totalPages };
  }
  async updateUser(userId: string, isAdmin: boolean) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.isAdmin = isAdmin;
    await user.save();
    return user;
  }
  async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    await user.deleteOne();
  }
}
export default new UsersService();
