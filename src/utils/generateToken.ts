import jwt from "jsonwebtoken";
import { Response } from "express";
export const generateTokenAndSetCookie = (
  id: string,
  res: Response
): string | undefined => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      sameSite: "lax",
      secure: false,

      path: "/",
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return undefined;
  }
};
