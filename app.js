const express = require("express");
const todoRoutes = require("./routes/todos");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
