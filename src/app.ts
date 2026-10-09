import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRoutes from "./routes/todos.js";
import errorHandler from "./middleware/errorHandler.js";
import "dotenv/config";

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/todo";
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: clientUrl.split(","),
    credentials: true,
  })
);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/todos", todoRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
