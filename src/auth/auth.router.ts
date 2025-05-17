import { Router } from "express";
import authController from "./auth.controller";
import { protect } from "../utils/protect";
const authRouter = Router();
authRouter.get("/me", protect, authController.getMe);
authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;
