import { Router } from "express";
import UserController from "./users.controller";

const usersRouter = Router();
usersRouter.get("/", UserController.getUsers);
usersRouter.get("/profile", UserController.getProfile);
usersRouter.put("/:id", UserController.updateUser);
usersRouter.delete("/:id", UserController.deleteUser);
export default usersRouter;
