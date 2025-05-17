import { NextFunction, Request, Response } from "express";
import { AsyncWrapper } from "../utils/AsyncWrapper";
import authService from "./auth.service";
import { UserReturnType, userType } from "../users/user.type";
import { generateTokenAndSetCookie } from "../utils/generateToken";
class AuthController {
  private authService;

  constructor() {
    this.authService = authService;
  }

  signup = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: userType = req.body;
      const createdUser = (await this.authService.signup(
        user
      )) as UserReturnType;
      const token = generateTokenAndSetCookie(createdUser._id, res);
      res.status(200).json({
        message: "User created successfully",
        user: createdUser,
        token,
      });
    }
  );

  login = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = (await this.authService.login(
        email,
        password
      )) as UserReturnType;

      const token = generateTokenAndSetCookie(user._id, res);
      return res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
      });
    }
  );
  logout = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.clearCookie("jwt");

      return res.status(200).json({
        message: "User logged out successfully",
      });
    }
  );
  getMe = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string | undefined = req.user?._id;
      if (!userId) {
        return res.status(400).json({
          message: "login to get your profile",
        });
      }
      const user = await this.authService.getMe(userId);
      return res.status(200).json(user);
    }
  );
}

export default new AuthController();
