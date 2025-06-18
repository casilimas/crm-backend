
const User = require('../../models/User');
const cloudinary = require('../../config/cloudinary');

const removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // ✅ Evitar eliminar el avatar por defecto
    if (user.avatarPublicId && user.avatarPublicId !== 'perfiles/avatarEdit') {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // ✅ Restaurar avatar por defecto usando variable de entorno
    user.avatar = process.env.DEFAULT_AVATAR;
    user.avatarPublicId = ''; // ← No se guarda public_id para el avatar por defecto
    await user.save();

    res.json({
      message: 'Avatar personalizado eliminado. Se restauró el avatar por defecto.',
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar avatar', error: error.message });
  }
};

module.exports = removeAvatar;
