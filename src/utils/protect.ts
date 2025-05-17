import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../users/users.model";
import { UserReturnType } from "../users/user.type";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserReturnType;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 5. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "No user found with this ID" });
    }

    req.user = user as UserReturnType;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token. Not authorized." });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
