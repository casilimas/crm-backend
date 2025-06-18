const User = require('../../models/User');

// 📋 Obtener usuarios por departamento
const getUsersByDepartment = async (req, res) => {
  const { id } = req.params; // ID del departamento

  try {
    const users = await User.find({ department: id }).select('-password').populate('department', 'name');
    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios por departamento:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios por departamento' });
  }
};

module.exports = getUsersByDepartment;
