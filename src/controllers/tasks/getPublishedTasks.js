// 📁 src/controllers/tasks/getPublishedTasks.js

const Task = require("../../models/Task");

const getPublishedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ published: true })
      .populate("assignedBy", "name")
      .populate("assignedTo", "name")
      .sort({ publishedAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas publicadas:", error);
    res.status(500).json({ message: "Error al obtener tareas publicadas" });
  }
};

module.exports = getPublishedTasks;
