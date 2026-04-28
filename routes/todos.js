const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

router.get("/", async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req?.params?.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo is fetch successfully", data: todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo is updated successfully", data: todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo is deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
