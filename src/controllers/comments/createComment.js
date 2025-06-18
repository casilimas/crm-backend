const Comment = require('../../models/Comment');
const Task = require('../../models/Task');

const createComment = async (req, res) => {
  const { taskId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    if (task.status !== 'completada') {
      return res.status(400).json({ message: 'Solo se pueden comentar tareas completadas' });
    }

    const comment = await Comment.create({
      taskId,
      userId,
      message
    });

    res.status(201).json({ message: 'Comentario publicado', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar el comentario', error: error.message });
  }
};

module.exports = createComment;
