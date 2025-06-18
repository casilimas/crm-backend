const mongoose = require('mongoose');
const Task = require('../../models/Task');

const getHistoricalTasks = async (req, res) => {
  try {
    const { departmentId } = req.query;

    // Si se proporciona un ID de departamento en query, se usa; de lo contrario, usa el histórico
    const selectedDepartmentId = new mongoose.Types.ObjectId(
      departmentId || process.env.HISTORICAL_DEPARTMENT_ID
    );

    

    const tasks = await Task.find({ department: selectedDepartmentId })
      .populate('assignedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ updatedAt: -1 });

    const formatted = tasks.map(task => {
      const wasDeletedUser = !task.assignedTo && !!task.originalUserName;

      return {
        id: task._id,
        title: task.title,
        status: task.status,
        completedAt: task.completedAt,
        assignedBy: task.assignedBy?.name || 'Desconocido',
        completedBy: task.assignedTo?.name || task.originalUserName || 'Desconocido',
        wasDeletedUser,
        report: task.report || null,
        images: task.images || [],
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };
    });

    res.status(200).json({ total: formatted.length, tasks: formatted });
  } catch (error) {
    console.error('❌ Error al obtener tareas por departamento:', error);
    res.status(500).json({ message: 'Error al obtener tareas del departamento' });
  }
};

module.exports = getHistoricalTasks;
