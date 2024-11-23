const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticateToken = require("./auth");

// Create Task
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;

        if (!title || !desc) {
            return res.status(400).json({ message: "Title and description are required." });
        }
        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }

        const newTask = new Task({ title, desc });
        const saveTask = await newTask.save();
        const taskId = saveTask._id;

        await User.findByIdAndUpdate(id, { $push: { tasks: taskId } });

        res.status(200).json({ message: "Task Created" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get All Tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const UserData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } },
        });
        res.status(200).json({ data: UserData.tasks }); // Ensure only tasks are returned
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Delete Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;

        if (!userId || !id) {
            return res.status(400).json({ message: "Task ID and User ID are required." });
        }

        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

        res.status(200).json({ message: "Task Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;

        if (!title || !desc) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        await Task.findByIdAndUpdate(id, { title, desc });

        res.status(200).json({ message: "Task Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Important Task
router.put("/update-important-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);

        if (!TaskData) {
            return res.status(404).json({ message: "Task not found" });
        }

        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });

        res.status(200).json({ message: "Task Important Status Updated" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Update Completed Task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);

        if (!TaskData) {
            return res.status(404).json({ message: "Task not found" });
        }

        const CompleteTask = TaskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !CompleteTask });

        res.status(200).json({ message: "Task Completed Status Updated" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get Important Tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { important: true },
            options: { sort: { createdAt: -1 } },
        });

        const ImpTaskData = Data.tasks;
        res.status(200).json({ data: ImpTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

// Get Completed Tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: true },
            options: { sort: { createdAt: -1 } },
        });

        const CompletedTaskData = Data.tasks;
        res.status(200).json({ data: CompletedTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Get InComplete Tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: false },
            options: { sort: { createdAt: -1 } },
        });

        const InCompletedTaskData = Data.tasks;
        res.status(200).json({ data: InCompletedTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
