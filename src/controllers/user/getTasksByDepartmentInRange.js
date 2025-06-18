// 📁 src/controllers/tasks/getTasksByDepartmentInRange.js
const Task = require('../../models/Task');
const User = require('../../models/User');
const mongoose = require('mongoose');

const getTasksByDepartmentInRange = async (req, res) => {
  const { departmentId } = req.params;
  const { start, end } = req.query;

  try {
    // 🗓️ Validar fechas
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: 'Fechas inválidas' });
    }

    if (diffInDays > 15) {
      return res.status(400).json({ message: 'El rango de fechas no puede superar los 15 días' });
    }

    // 👥 Buscar usuarios del departamento
    const users = await User.find({ department: departmentId }).select('_id');
    const userIds = users.map((u) => u._id);

    // 🔍 Buscar tareas COMPLETADAS en ese rango asignadas a usuarios del departamento
    const tasks = await Task.find({
      assignedTo: { $in: userIds },
      assignedAt: { $gte: startDate, $lte: endDate },
      status: 'completada', // ✅ Solo tareas completadas
    })
      .populate('assignedBy', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ assignedAt: -1 });

    res.json({ total: tasks.length, tasks });

  } catch (error) {
    console.error('❌ Error al obtener tareas por departamento:', error);
    res.status(500).json({ message: 'Error al obtener tareas por departamento', error: error.message });
  }
};

module.exports = getTasksByDepartmentInRange;
