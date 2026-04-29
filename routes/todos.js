import express from "express";
import Todo from "../models/Todo.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  // if (req.query.completed !== undefined) {
  //   const isCompleted = req.query.completed === "true";
  //   result = result.filter((t) => t.completed === isCompleted);
  // }

  // if (req.query.priority) {
  //   result = result?.filter((t) => t.priority === req.query.priority);
  // }

  // you need to add filter of priority and completed in this api

  const todos = await Todo.find();
  res.json({ message: "Todos is fetch successfully", data: todos });

  try {
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req?.params?.id);
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is fetch successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      priority: req.body.priority,
    });

    res.status(201).json({ message: "Todo is created successfully" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is updated successfully", data: todo });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return next(new AppError("Todo not found", 404));
    res.json({ message: "Todo is deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
