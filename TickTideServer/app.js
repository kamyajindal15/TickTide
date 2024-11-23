const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/connection");
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// API Routes
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

// Fallback Route
app.get("/", (req, res) => {
    res.send("Hello from backend side");
});

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
