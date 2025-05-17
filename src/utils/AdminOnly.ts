import { Request, Response, NextFunction } from "express";

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Admins only" });
  }
};
