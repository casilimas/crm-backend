const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// 📨 Obtener notificaciones del usuario logueado
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
});

// ✅ Marcar como leída la última notificación no leída
router.put('/read', protect, async (req, res) => {
  try {
    const noti = await Notification.findOneAndUpdate(
      { user: req.user._id, read: false },
      { read: true },
      { new: true, sort: { createdAt: -1 } }
    );

    if (!noti) {
      return res.status(404).json({ message: 'No hay notificaciones no leídas' });
    }

    res.json({ message: 'Notificación marcada como leída', noti });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar notificación' });
  }
});

module.exports = router;
