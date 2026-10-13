import { NextFunction, Request, Response, Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = Router();

const signToken = (id: string) => jwt.sign({ id });

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({ name, email, password });

      res.status(201).json({
        token: signToken(user.id),
      });
    } catch (error) {
      next(error);
    }
  },
);
