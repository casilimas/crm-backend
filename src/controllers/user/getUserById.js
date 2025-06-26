const User = require('../../models/User');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select('-password') // Excluye la contraseña
      .populate('department', 'name'); // Trae el nombre del departamento

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      avatarPublicId: user.avatarPublicId,
      department: user.department?.name || 'Sin Departamento',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = getUserById;
