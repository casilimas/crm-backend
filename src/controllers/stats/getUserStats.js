// controllers/stats/getUserStats.js

const Task = require('../../models/Task');
const User = require('../../models/User');

const getUserStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('name email');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const allTasks = await Task.find({ assignedTo: userId });

    const totalTasks = allTasks.length;
    const completed = allTasks.filter(task => task.status === 'completada');
    const completedTasks = completed.length;
    const pendingTasks = totalTasks - completedTasks;

    const performance = totalTasks > 0
      ? ((completedTasks / totalTasks) * 100).toFixed(2)
      : '0.00';

    // Cálculo de eficiencia: menor tiempo real = más eficiente
    let totalEfficiency = 0;
    let validEfficiencies = 0;

    for (const task of completed) {
      const assignedAt = new Date(task.assignedAt);
      const completedAt = new Date(task.completedAt);
      const realDuration = (completedAt - assignedAt) / (1000 * 60 * 60); // en horas

      if (realDuration >= 0.1 && task.durationHours > 0) {
        // Calcular eficiencia en base a cuánto tiempo usó de lo asignado
        let efficiency = (realDuration / task.durationHours) * 100;

        // Limitar a 100% como máximo
        if (efficiency > 100) efficiency = 100;

        totalEfficiency += efficiency;
        validEfficiencies++;
      }
    }

    const finalEfficiency = validEfficiencies > 0
      ? totalEfficiency / validEfficiencies
      : 0;

    const efficiencyString = finalEfficiency.toFixed(2) + '%';

    // Clasificación personalizada (basado en tu criterio)
    let efficiencyStatus = 'Sin datos';
    if (finalEfficiency >= 70) {
      efficiencyStatus = 'Eficiente';
    } else if (finalEfficiency >= 50) {
      efficiencyStatus = 'Óptimo';
    } else if (finalEfficiency >= 25) {
      efficiencyStatus = 'Regular';
    } else if (finalEfficiency > 0) {
      efficiencyStatus = 'Lento';
    }

    res.json({
      user,
      totalTasks,
      completedTasks,
      pendingTasks,
      performance: `${performance}%`,
      averageTimeEfficiency: efficiencyString,
      efficiencyStatus
    });

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = getUserStats;
