const Task = require('../../models/Task');

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    // Solo quien la asignó puede modificarla
    if (task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
    }

    const updates = req.body;
    Object.assign(task, updates);

    await task.save();

    res.json({ message: 'Tarea actualizada', task });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

module.exports = updateTask;
