

const Task = require('../../models/Task');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const sendEmail = require('../../controllers/utils/sendEmail'); 

const createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo, durationHours } = req.body;
  const assignedBy = req.user;

  try {
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: 'Usuario asignado no encontrado' });
    }

    if (assignedUser.status !== 'presente') {
      return res.status(400).json({ message: 'Solo se pueden asignar tareas a usuarios con estado presente' });
    }

    // ⛔ Verificar si ya tiene tarea pendiente
    const existingPendingTask = await Task.findOne({
      assignedTo,
      status: 'pendiente',
    });

    if (existingPendingTask) {
      return res.status(400).json({
        message: 'Este usuario ya tiene una tarea pendiente. No se puede asignar otra hasta que la complete o se elimine.',
      });
    }

    if (assignedBy.role === 'admin') {
      if (assignedUser.role === 'admin') {
        return res.status(403).json({ message: 'No se puede asignar tareas a otros administradores' });
      }
    } else if (assignedBy.role === 'jefe') {
      if (assignedUser.role !== 'trabajador') {
        return res.status(403).json({ message: 'Los jefes solo pueden asignar tareas a trabajadores' });
      }
    } else {
      return res.status(403).json({ message: 'No tienes permiso para asignar tareas' });
    }

    if (!durationHours || durationHours < 1 || durationHours > 12) {
      return res.status(400).json({ message: 'La duración debe ser entre 1 y 12 horas' });
    }

    const assignedAt = new Date();
const dueDateCalculated = new Date(assignedAt.getTime() + durationHours * 60 * 60 * 1000);

const task = new Task({
  title,
  description,
  priority,
  dueDate: dueDateCalculated,
  durationHours,
  assignedTo,
  assignedBy: assignedBy._id,
  status: 'pendiente',
  assignedAt,
  department: assignedUser.department,
});


    await task.save();

    await Notification.create({
      user: assignedUser._id,
      message: `Tienes una nueva tarea: ${task.title}`
    });

    // ✅ Enviar correo al usuario asignado
    await sendEmail({
      to: assignedUser.email,
      subject: 'Nueva tarea asignada',
      text: `Hola ${assignedUser.name}, tienes una nueva tarea: "${task.title}" con prioridad ${task.priority}. Fecha límite: ${new Date(task.dueDate).toLocaleDateString()}. Duración estimada: ${task.durationHours} hora(s).`
    });

    res.status(201).json({ message: 'Tarea creada correctamente', task });

  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

module.exports = createTask;

