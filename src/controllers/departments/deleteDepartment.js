const Department = require('../../models/Department');
const User = require('../../models/User');

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado' });
    }

    // ❌ Proteger el departamento "Histórico"
    if (department.name.trim().toLowerCase() === 'histórico') {
      return res.status(400).json({
        message: 'No está permitido eliminar el departamento Histórico'
      });
    }

    // ✅ Validar que no tenga usuarios activos
    const usersInDepartment = await User.find({ department: id });
    if (usersInDepartment.length > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar un departamento que tiene usuarios asignados'
      });
    }

    await department.deleteOne();
    res.json({ message: 'Departamento eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar departamento:', error);
    res.status(500).json({ message: 'Error interno al eliminar el departamento' });
  }
};

module.exports = deleteDepartment;
