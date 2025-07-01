

const Task = require('../../models/Task');

const eliminarTareaPendiente = async (req, res) => {
  const userId = req.user._id;

  try {
    const tasks = await Task.find({ assignedBy: userId })
      .populate('assignedTo', 'name email role')
      .sort({ assignedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('❌ Error al obtener tareas asignadas:', error);
    res.status(500).json({ message: 'Error al obtener tareas asignadas', error: error.message });
  }
};

module.exports = eliminarTareaPendiente;
