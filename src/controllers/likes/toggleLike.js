const Like = require('../../models/Like');

const toggleLike = async (req, res) => {
  const { taskId } = req.params;
  const { type } = req.body;
  const userId = req.user._id;

  try {
    const existing = await Like.findOne({ taskId, userId });

    if (existing) {
      if (existing.type === type) {
        await existing.deleteOne();
        return res.status(200).json({ message: 'Like eliminado' });
      } else {
        existing.type = type;
        await existing.save();
        return res.status(200).json({ message: 'Tipo de like actualizado' });
      }
    }

    const newLike = await Like.create({ taskId, userId, type });
    res.status(201).json({ message: 'Like agregado', like: newLike });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar like', error: err.message });
  }
};

module.exports = toggleLike;
