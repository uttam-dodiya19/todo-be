import { Router } from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/protect.js";

const router = Router();
router.use(protect);
router.route("/").get(getTodos).post(createTodo);

router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;
