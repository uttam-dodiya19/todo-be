import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // Mongoose ValidationError — missing required field, wrong type etc
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose CastError — invalid ID format
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // custom AppError — carries its own status code
  if (err instanceof AppError || err.statusCode) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }

  // fallback — unknown server error
  console.error(err);
  return res.status(500).json({ message: "Something went wrong" });
};

export default errorHandler;
