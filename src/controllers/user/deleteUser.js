const User = require('../../models/User');
const Task = require('../../models/Task');
const Department = require('../../models/Department');

const deleteUser = async (req, res) => {
  const { name, email, department } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede eliminar usuarios.' });
  }

  try {
    // 🔍 Buscar el departamento por nombre
    const departmentDoc = await Department.findOne({ name: department });
    if (!departmentDoc) {
      return res.status(404).json({ message: 'Departamento no encontrado' });
    }

    // 🔍 Buscar el usuario por nombre, email y departamento
    const user = await User.findOne({
      name,
      email,
      department: departmentDoc._id
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado con los datos proporcionados' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'No está permitido eliminar usuarios con rol admin.' });
    }

    // ✅ Buscar el departamento Histórico por ID desde .env
    const historicalDept = await Department.findById(process.env.HISTORICAL_DEPARTMENT_ID);
    if (!historicalDept) {
      return res.status(500).json({ message: 'Departamento Histórico no encontrado. No se puede continuar.' });
    }

    // ✅ Migrar tareas asignadas
    const tasks = await Task.find({ assignedTo: user._id });
    for (const task of tasks) {
      task.assignedTo = null;
      task.originalUserName = user.name;
      task.department = historicalDept._id;
      await task.save();
    }

    // ✅ Eliminar al usuario
    await user.deleteOne();

    res.json({
      message: 'Usuario eliminado correctamente y sus tareas fueron migradas al departamento Histórico.'
    });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = deleteUser;
