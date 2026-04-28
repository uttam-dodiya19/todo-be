const express = require("express");
const todoRoutes = require("./routes/todos");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
