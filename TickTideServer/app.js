const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/connection"); // Ensure your DB connection is established
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task"); // This is your updated task route

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// API Routes
app.use("/api/v1", UserAPI); // Routes for user-related APIs
app.use("/api/v2", TaskAPI); // Routes for task-related APIs including the generate-report route

// Fallback Route
app.get("/", (req, res) => {
    res.send("Hello from backend side");
});

const PORT = 1000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
