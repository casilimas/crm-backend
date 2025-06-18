/*
const User = require('../../models/User');

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'La nueva contraseña es obligatoria' });
  }

  // Solo admin puede cambiar contraseñas
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo el administrador puede cambiar contraseñas.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    

    // 🔄 Asignar nueva contraseña en texto plano (será hasheada por el middleware pre('save'))
    user.password = String(password);
    await user.save();

    

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message });
  }
};

module.exports = updatePassword;
*/

const User = require('../../models/User');

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'La nueva contraseña es obligatoria' });
  }

  try {
    // Buscar usuario a modificar
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Validar permisos: debe ser el mismo usuario o un admin
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para cambiar esta contraseña' });
    }

    // Cambiar contraseña (se encriptará automáticamente)
    user.password = String(password);
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message });
  }
};

module.exports = updatePassword;
