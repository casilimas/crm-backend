const User = require('../../models/User');

const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo es obligatorio' });
  }

  try {
    const user = await User.findOne({ email })
      .select('-password')
      .populate('department', 'name'); // 👈 trae solo el nombre del departamento

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
      department: user.department?.name || 'Sin Departamento'
    });
  } catch (error) {
    console.error('❌ Error al buscar usuario por correo:', error);
    res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
  }
};

module.exports = getUserByEmail;
