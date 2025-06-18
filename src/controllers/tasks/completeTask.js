

const Task = require('../../models/Task');
const cloudinary = require('../../config/cloudinary');

// Función para subir imagen desde buffer
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

    // 🚫 Evitar completar múltiples veces
    if (task.status === 'completada') {
      return res.status(400).json({ message: 'La tarea ya fue completada anteriormente' });
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mime = file.mimetype;

        // Solo aceptar imágenes válidas
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





    // 🟥 NUEVA VALIDACIÓN ESTRICTA
    if (!report || uploadedImages.length === 0) {
      return res.status(400).json({
        message: 'Para completar la tarea debes incluir tanto el reporte como al menos una imagen.'
      });
    }
    // 🟥 FIN DE VALIDACIÓN NUEVA





    
    task.status = 'completada';
    task.completedAt = new Date();
    task.report = report;
    task.images = uploadedImages;

    await task.save();

    res.json({ message: 'Tarea completada exitosamente', task });
  } catch (error) {
    console.error('❌ Error al completar la tarea:', error);
    res.status(500).json({
      message: 'Error al completar la tarea',
      error: error.message
    });
  }
};

module.exports = completeTask;











