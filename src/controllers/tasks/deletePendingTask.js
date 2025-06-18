const Task = require('../../models/Task');
const Notification = require('../../models/Notification');
const User = require('../../models/User');
const sendEmail = require('../utils/sendEmail');

const deletePendingTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    if (task.status !== 'pendiente') {
      return res.status(400).json({ message: 'Solo puedes eliminar tareas pendientes' });
    }

    if (!task.assignedBy.equals(userId)) {
      return res.status(403).json({ message: 'No estás autorizado para eliminar esta tarea' });
    }

    // Eliminar notificación asociada
    await Notification.deleteOne({ user: task.assignedTo, message: { $regex: task.title } });

    // Obtener info del usuario asignado y del asignador
    const assignedUser = await User.findById(task.assignedTo);
    const assignerUser = await User.findById(task.assignedBy);

    // Formatear fecha de asignación (opcional)
    const assignedDate = task.assignedAt
      ? new Date(task.assignedAt).toLocaleDateString('es-ES')
      : 'fecha desconocida';

    // Eliminar la tarea
    await task.deleteOne();

    // Enviar correo al usuario asignado
    if (assignedUser && assignedUser.email) {
      await sendEmail({
        to: assignedUser.email,
        subject: 'Tarea eliminada',
        text: `Hola ${assignedUser.name},

Te informamos que la tarea "${task.title}" que te había sido asignada el día ${assignedDate} ha sido eliminada por quien te la asignó.

Por favor, si tienes dudas o necesitas más información, comunícate directamente con ${assignerUser.name} al correo: ${assignerUser.email}.

Gracias por tu atención.`
      });
    }

    res.json({ message: 'Tarea pendiente eliminada correctamente y notificación enviada' });
  } catch (error) {
    console.error('❌ Error al eliminar tarea pendiente:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};

module.exports = deletePendingTask;
