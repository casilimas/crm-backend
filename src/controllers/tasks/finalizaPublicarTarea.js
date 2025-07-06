const Task = require('../../models/Task');
const cloudinary = require('cloudinary').v2;

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

const finalizarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (task.status === 'completada') {
      return res.status(400).json({ message: 'La tarea ya fue completada' });
    }

    if (task.assignedTo && !task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permiso para finalizar esta tarea' });
    }

    // 📝 Guardar reporte
    if (req.body.report) {
      task.report = req.body.report;
    }

    // 📸 Subir imágenes a Cloudinary
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await streamUpload(file.buffer, 'tareas');
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
      task.images = uploadedImages; // reemplazar si quieres solo nuevas imágenes
    }

    // ✅ Marcar como completada y publicada automáticamente
    task.status = 'completada';
    task.completedAt = new Date();
    task.published = true;
    task.publishedAt = new Date();

    await task.save();

    res.status(200).json({ message: 'Tarea completada y publicada automáticamente', task });
  } catch (error) {
    console.error('❌ Error al completar y publicar la tarea:', error);
    res.status(500).json({ message: 'Error interno al completar la tarea' });
  }
};

module.exports = finalizarTarea;
