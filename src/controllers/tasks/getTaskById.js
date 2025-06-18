const Task = require('../../models/Task');

// 🔍 Obtener una tarea específica por su ID
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(task);
  } catch (error) {
    console.error('❌ Error al obtener la tarea:', error);
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

module.exports = getTaskById;
