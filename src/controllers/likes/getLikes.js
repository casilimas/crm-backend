const Like = require('../../models/Like');

const getLikes = async (req, res) => {
  const { taskId } = req.params;

  try {
    const positivos = await Like.countDocuments({ taskId, type: 'positivo' });
    const negativos = await Like.countDocuments({ taskId, type: 'negativo' });

    res.status(200).json({ positivos, negativos });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los likes', error: err.message });
  }
};

module.exports = getLikes;
