import { Request, Response, NextFunction } from "express";
import Todo from "../models/Todo.js";
import AppError from "../utils/AppError.js";

// GET /todos
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filter: any = {};

    // Filter by completed
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }

    // Filter by priority
    if (req.query.priority) {
      filter.priority = req.query.priority as string;
    }

    // Search by title
    if (req.query.search) {
      const searchTerm = req.query.search as string;
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.title = {
        $regex: escaped,
        $options: "i", // Case-insensitive search is standard
      };
    }

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const sortField = ["createdAt", "title", "priority", "completed"].includes(
      req.query.sortBy as string,
    )
      ? (req.query.sortBy as string)
      : "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Todo.countDocuments(filter),
    ]);

    res.json({
      message: "Todos is fetch successfully",
      data: todos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// GET /todos/:id
export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(new AppError("Todo not found", 404));
    }
    res.json({ message: "Todo is fetch successfully", data: todo });
  } catch (error) {
    next(error);
  }
};

// POST /todos
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, priority } = req.body;
    const newTodo = await Todo.create({
      title,
      priority,
    });

    res
      .status(201)
      .json({ message: "Todo is created successfully", data: newTodo });
  } catch (error) {
    next(error);
  }
};

// PUT /todos/:id
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return next(new AppError("Todo not found", 404));
    }
    res.json({ message: "Todo is updated successfully", data: todo });
  } catch (error) {
    next(error);
  }
};

// DELETE /todos/:id
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return next(new AppError("Todo not found", 404));
    }
    res.json({ message: "Todo is deleted successfully" });
  } catch (error) {
    next(error);
  }
};
