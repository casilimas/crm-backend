const User = require('../../models/User');
const Department = require('../../models/Department');

const ADMIN_DEPARTMENT_ID = process.env.ADMIN_DEPARTMENT_ID;

const moveDepartment = async (req, res) => {
  const { userId } = req.params;
  const { newDepartmentId } = req.body;

  try {
    // Validar que el nuevo departamento existe
    const department = await Department.findById(newDepartmentId);
    if (!department) {
      return res.status(404).json({ message: 'Departamento destino no encontrado' });
    }

    // Evitar mover al departamento "Histórico" directamente
    if (department.name.toLowerCase() === 'histórico') {
      return res.status(400).json({ message: 'No se puede migrar manualmente al departamento Histórico' });
    }

    // Validar existencia del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 🚫 Validar si está intentando migrar al mismo departamento
    if (user.department.toString() === newDepartmentId.toString()) {
      return res.status(400).json({ message: 'El usuario ya pertenece a ese departamento' });
    }

    // 🚫 Bloquear migración al departamento administrativo si no es admin
    if (
      newDepartmentId.toString() === ADMIN_DEPARTMENT_ID &&
      (user.role === 'jefe' || user.role === 'trabajador')
    ) {
      return res.status(400).json({
        message: 'Solo administradores pueden pertenecer al departamento Administrativo'
      });
    }

    // ✅ Actualizar departamento
    user.department = newDepartmentId;
    await user.save();

    res.status(200).json({
      message: 'Usuario migrado exitosamente al nuevo departamento',
      user: {
        _id: user._id,
        name: user.name,
        department: user.department
      }
    });

  } catch (error) {
    console.error('❌ Error al migrar usuario:', error);
    res.status(500).json({ message: 'Error interno al migrar usuario' });
  }
};

module.exports = moveDepartment;
