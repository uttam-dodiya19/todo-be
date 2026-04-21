const express = require("express");
const router = express.Router();

const todos = [
  { id: 1, title: "Go to gym", completed: true, priority: "high" },
  { id: 2, title: "today leaning", completed: false, priority: "high" },
  { id: 3, title: "eating dinner", completed: true, priority: "low" },
];

function validateTodo(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  next();
}

router.get("/", (req, res) => {
  let result = todos;

  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === "true";
    result = result.filter((t) => t.completed === isCompleted);
  }

  if (req.query.priority) {
    result = result?.filter((t) => t.priority === req.query.priority);
  }

  res.json(result);
});

router.get("/:id", (req, res) => {
  const todo = todos.find((todo) => todo?.id === Number(req?.params?.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

router.post("/", validateTodo, (req, res) => {
  const { title, priority } = req.body;

  const newTodo = {
    title,
    id: todos?.length + 1,
    priority: priority || "low",
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put("/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.completed = req.body.completed ?? todo.completed;
  todo.title = req.body.title ?? todo.title;

  res.json(todo);
});

router.delete("/:id", (req, res) => {
  const todo = todos.filter((todo) => todo?.id === Number(req?.params?.id));
  res.json({ message: "Todo deleted" });
});

module.exports = router;
