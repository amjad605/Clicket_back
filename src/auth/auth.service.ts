import { userType } from "../users/user.type";
import User from "../users/users.model";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError";
import { generateTokenAndSetCookie } from "../utils/generateToken";
class AuthService {
  constructor() {}
  async signup(user: userType) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      ...user,
      password: hashedPassword,
    });
    if (!newUser) {
      throw new AppError("Failed to create user", 500);
    }
    await newUser.save();

    return newUser;
  }
  async login(email: string, password: string) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AppError("Wrong Credentials", 400);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Wrong Credentials", 400);
    }
    return user;
  }
  async getMe(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}
export default new AuthService();
//
