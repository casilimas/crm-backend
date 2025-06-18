

const User = require('../../models/User');
const cloudinary = require('../../config/cloudinary');

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen' });

    // 🧹 Eliminar avatar anterior de Cloudinary si no es el por defecto
    if (user.avatarPublicId && user.avatarPublicId !== 'perfiles/avatarEdit') {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // 📤 Subir nuevo avatar como .webp desde buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'perfiles',
          format: 'webp',       // ✅ Forzar conversión a .webp
          quality: 'auto'       // ✅ Optimiza automáticamente la compresión
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // 💾 Guardar nueva info en el usuario
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({ message: 'Avatar actualizado', avatar: user.avatar });
  } catch (error) {
    console.error('❌ Error al subir avatar:', error);
    res.status(500).json({ message: 'Error al subir avatar', error: error.message });
  }
};

module.exports = uploadAvatar;
