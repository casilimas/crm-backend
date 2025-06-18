

const User = require('../../models/User');
const Department = require('../../models/Department');

const getAllUsers = async (req, res) => {
  try {
    // Traer todos los usuarios con su departamento
    //const users = await User.find().select('-password').populate('department', 'name');
    const users = await User.find()
  .select('-password')
  .populate('department', 'name'); // 👈 esto trae solo el nombre del departamento


    // Agrupar por nombre del departamento
    const grouped = {};

    users.forEach(user => {
      const deptName = user.department?.name || 'Sin Departamento';
      if (!grouped[deptName]) {
        grouped[deptName] = [];
      }

      grouped[deptName].push({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        avatarPublicId: user.avatarPublicId,
      });
    });

    res.json(grouped);
  } catch (error) {
    console.error('❌ Error al listar usuarios agrupados:', error);
    res.status(500).json({ message: 'Error al obtener usuarios agrupados por departamento' });
  }
};

module.exports = getAllUsers;
