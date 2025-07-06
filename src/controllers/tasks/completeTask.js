const Task = require('../../models/Task');
const cloudinary = require('../../config/cloudinary');

const streamUpload = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        format: 'webp',
        transformation: [{ quality: 'auto' }]
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

const completeTask = async (req, res) => {
  const { id } = req.params;
  const { report } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Solo el usuario asignado puede completar la tarea' });
    }

    if (task.status === 'completada') {
      return res.status(400).json({ message: 'La tarea ya fue completada anteriormente' });
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mime = file.mimetype;
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
          return res.status(400).json({
            message: `Formato de imagen no permitido: ${mime}. Solo se permiten JPG, JPEG o PNG.`
          });
        }

        const result = await streamUpload(file.buffer, 'tareas');
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    if (!report || uploadedImages.length === 0) {
      return res.status(400).json({
        message: 'Para completar la tarea debes incluir tanto el reporte como al menos una imagen.'
      });
    }

    // ✅ Actualización con publicación automática
    await Task.findByIdAndUpdate(id, {
      status: 'completada',
      completedAt: new Date(),
      report,
      images: uploadedImages,
      published: true,
      publishedAt: new Date()
    });

    res.json({ message: 'Tarea completada y publicada exitosamente' });
  } catch (error) {
    console.error('❌ Error al completar la tarea:', error);
    res.status(500).json({
      message: 'Error al completar la tarea',
      error: error.message
    });
  }
};

module.exports = completeTask;
