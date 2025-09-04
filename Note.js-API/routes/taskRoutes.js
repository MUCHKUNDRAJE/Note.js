const express = require("express");
const taskService = require("../services/taskService");
const router = express.Router();

router.post("/createtask", async (req, res) => {
  try {
    const { task_title } = req.body;
    const docRef = await taskService.createTask(task_title);
    res.json({ message: "Task created", id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/gettask", async (req, res) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/gettaskdetails", async (req, res) => {
  try {
    const { id } = req.body;
    const task = await taskService.getTaskDetails(id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/deletetask/:id", async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
