const User = require('../../models/User');

const updateEmail = async (req, res) => {
  const { id } = req.params;
  const { newEmail } = req.body;

  if (!newEmail) {
    return res.status(400).json({ message: 'El nuevo correo es obligatorio' });
  }

  // Solo admin puede hacer esto
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede cambiar correos.' });
  }

  try {
    const emailExistente = await User.findOne({ email: newEmail });
    if (emailExistente) {
      return res.status(400).json({ message: 'Este correo ya está en uso' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.email = newEmail.toLowerCase();
    await user.save();

    res.json({ message: 'Correo actualizado correctamente', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el correo', error: error.message });
  }
};

module.exports = updateEmail;
