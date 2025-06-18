


const User = require('../../models/User');

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['presente', 'ausente', 'permiso'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Estado inválido. Usa: presente, ausente o permiso' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.status = status;
    await user.save();

    res.json({ message: 'Estado actualizado correctamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado', error: error.message });
  }
};

module.exports = updateStatus;
