import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
    },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      default: "low",
      enum: ["low", "medium", "high"],
    },
  },
  { timestamps: true },
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
