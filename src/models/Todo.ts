import { Schema, model, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const todoSchema = new Schema<ITodo>(
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

export default model<ITodo>("Todo", todoSchema);
