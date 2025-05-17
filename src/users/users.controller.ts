import { Request, Response, NextFunction } from "express";
import usersService from "./users.service";
import { AsyncWrapper } from "../utils/AsyncWrapper";
class UserController {
  private usersService;
  constructor() {
    this.usersService = usersService;
  }
  getProfile = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string | undefined = req.user?._id;
      if (!userId) {
        return res.status(400).json({
          message: "login to get your profile",
        });
      }

      const user = await this.usersService.getProfile(userId);
      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    }
  );
  getUsers = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const excludeUserId = req.params.id;
      const { page, limit } = req.query;
      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 10;

      const { users, totalPages } = await this.usersService.getUsers(
        excludeUserId,
        pageNumber,
        limitNumber
      );

      res.status(200).json({
        message: "Users fetched successfully",
        users,
        totalPages,
      });
    }
  );

  updateUser = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const { isAdmin } = req.body;
      const user = await this.usersService.updateUser(userId, isAdmin);
      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    }
  );
  deleteUser = AsyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      await this.usersService.deleteUser(userId);
      res.status(200).json({
        message: "User deleted successfully",
      });
    }
  );
}
export default new UserController();
