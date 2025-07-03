const Notification = require('../../models/Notification');

const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    // Busca la última notificación no leída
    const notificacion = await Notification.findOne({ user: userId, read: false })
      .sort({ createdAt: -1 });

    if (!notificacion) {
      return res.status(404).json({ message: 'No hay notificaciones por leer' });
    }

    notificacion.read = true;
    await notificacion.save();

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('❌ Error al marcar notificación como leída:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

module.exports = markNotificationAsRead;
