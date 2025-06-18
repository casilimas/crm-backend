const Task = require('../../models/Task');

// 📋 Obtener todas las tareas asignadas a un usuario por su ID
const getTasksByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: id })
      .populate('assignedBy', 'name email role') // quien asignó
      .select('-__v'); // limpio el exceso

    res.json(tasks);
  } catch (error) {
    console.error('❌ Error al obtener tareas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener tareas del usuario' });
  }
};

module.exports = getTasksByUser;
