


const Department = require('../../models/Department');

const createDepartment = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre del departamento es obligatorio' });
  }

  // 🔒 Normalización para prevenir creación de "Histórico" en cualquier forma
  const normalized = name
    .normalize('NFD')                     // Quita acentos (tildes)
    .replace(/[\u0300-\u036f]/g, '')      // Elimina marcas diacríticas
    .replace(/\s+/g, '')                  // Elimina espacios
    .toLowerCase();                       // Convierte a minúsculas

  if (normalized === 'historico') {
    return res.status(400).json({
      message: 'No está permitido crear un departamento con el nombre "Histórico" en ninguna variante'
    });
  }

  try {
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe un departamento con ese nombre' });
    }

    const department = await Department.create({ name });
    res.status(201).json({ message: 'Departamento creado correctamente', department });
  } catch (error) {
    console.error('❌ Error al crear departamento:', error);
    res.status(500).json({ message: 'Error interno al crear el departamento' });
  }
};

module.exports = createDepartment;
