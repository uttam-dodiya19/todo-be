import express from "express";
import Todo from "../models/Todo.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    // Filter by todos
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    //  Search by title todos
    if (req.query.search) {
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escaped, $options: "i" };
    }

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit), 50) || 10;
    const skip = (page - 1) * limit;
    const sortField = ["createdAt", "title", "priority", "completed"].includes(
      req.query.sortBy,
    )
      ? req.query.sortBy
      : "createdAt" || "";
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
});

router.get("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req?.params?.id);
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is fetch successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const doto = await Todo.create({
      title: req.body.title,
      priority: req.body.priority,
    });

    res
      .status(201)
      .json({ message: "Todo is created successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is updated successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
