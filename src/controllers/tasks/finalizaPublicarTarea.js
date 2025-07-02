const Task = require('../../models/Task');

const publicarTareaEnMuro = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'No puedes publicar esta tarea' });
    }

    if (task.status !== 'completada') {
      return res.status(400).json({ message: 'La tarea aún no ha sido completada' });
    }

    if (task.published) {
      return res.status(400).json({ message: 'La tarea ya fue publicada en el muro' });
    }

    task.published = true;
    task.publishedAt = new Date();
    await task.save();

    res.status(200).json({ message: 'Tarea publicada en el muro', task });
  } catch (error) {
    console.error('❌ Error al publicar tarea:', error);
    res.status(500).json({ message: 'Error interno al publicar la tarea' });
  }
};

module.exports = publicarTareaEnMuro;
