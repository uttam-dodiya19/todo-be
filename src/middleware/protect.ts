import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    // header looks like: "Bearer eyJhbGci..."
    if (!header?.startsWith("Bearer ")) {
      return next(new AppError("Not logged in", 401));
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = user; // every route after this knows who is calling
    next();
  } catch (err) {
    next(err); // expired or fake tokens throw, handled below
  }
};
