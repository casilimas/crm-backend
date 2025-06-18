// ✅ src/controllers/departments/getDepartments.js
const Department = require('../../models/Department');

// 📋 Obtener todos los departamentos
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }); // Orden alfabético
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los departamentos', error });
  }
};

module.exports = getDepartments;
