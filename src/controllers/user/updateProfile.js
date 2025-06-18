
const User = require('../../models/User');
const nodemailer = require('nodemailer');

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  const requester = req.user;

  try {
    const user = await User.findById(id).populate('department', 'name');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const oldRole = user.role;

    // ADMIN puede cambiar su propio nombre y editar nombre o rol de otros (excepto admins)
    if (requester.role === 'admin') {
      if (name) user.name = name;

      if (role) {
        if (oldRole === 'admin') {
          return res.status(403).json({ message: 'No puedes cambiar el rol de un usuario admin.' });
        }
        if (role === 'admin') {
          return res.status(403).json({ message: 'No está permitido asignar el rol de admin.' });
        }

        user.role = role;

        // 📨 Si el nuevo rol es "jefe", notificar al resto del departamento
        if (role === 'jefe') {
          const departmentUsers = await User.find({
            department: user.department._id,
            _id: { $ne: user._id }
          });

          const emails = departmentUsers.map(u => u.email);
          if (emails.length > 0) {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: emails,
              subject: '📢 Nuevo jefe de departamento asignado',
              text: `Se ha asignado a ${user.name} como nuevo jefe del departamento ${user.department.name}.`,
            };

            await transporter.sendMail(mailOptions);
          }
        }
      }
    }

    // Jefe o Trabajador pueden cambiar solo su propio nombre
    else if (requester._id.toString() === id) {
      if (name) {
        user.name = name;
      } else {
        return res.status(400).json({ message: 'Debe proporcionar un nuevo nombre' });
      }

      if (role) {
        return res.status(403).json({ message: 'No tienes permisos para cambiar el rol' });
      }
    }

    // Otros casos: acceso denegado
    else {
      return res.status(403).json({ message: 'No tienes permisos para editar este perfil' });
    }

    await user.save();
    res.json({ message: 'Perfil actualizado correctamente', user });

  } catch (error) {
    console.error('❌ Error en updateProfile:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

module.exports = updateProfile;
