const User = require('../../models/User');
const Department = require('../../models/Department');
const sendEmail = require('../../controllers/utils/sendEmail'); 

const registerUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role || !department) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }




  const mongoose = require('mongoose');
if (!mongoose.Types.ObjectId.isValid(department)) {
  return res.status(400).json({ message: 'ID de departamento inválido' });
}








  const departmentDoc = await Department.findById(department);
  //const departmentDoc = await Department.findOne({ name: department });

  if (!departmentDoc) {
    return res.status(400).json({ message: 'Departamento no encontrado' });
  }

  //if (department === process.env.HISTORICAL_DEPARTMENT_ID) {
  if (departmentDoc.name === 'Historico') {
    return res.status(400).json({
      message: 'No se permite registrar usuarios directamente en el departamento Histórico'
    });
  }

  if (role === 'admin' && departmentDoc.name !== 'Administrativo') {
    return res.status(400).json({
      message: 'El admin solo puede pertenecer al departamento Administrativo'
    });
  }

  const userCount = await User.countDocuments();
  if (userCount === 0 && role !== 'admin') {
    return res.status(400).json({ message: 'El primer usuario debe ser admin' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Este correo ya está registrado' });
  }

  try {
    //const user = await User.create({ name, email, password, role, department });

    const user = await User.create({
  name,
  email,
  password,
  role,
  department: departmentDoc._id
});


    // ✅ Enviar correo de bienvenida
    await sendEmail({
      to: email,
      subject: 'Bienvenido al sistema',
      text: `Hola ${name}, tu cuenta ha sido creada.\nTu contraseña de acceso es: ${password}`,
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

module.exports = registerUser;



