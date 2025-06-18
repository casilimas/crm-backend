const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/user/registerUsers');
const updateEmail = require('../controllers/user/updateEmail');
const updatePassword = require('../controllers/user/updatePassword');
const deleteUser = require('../controllers/user/deleteUser');
const createDepartment = require('../controllers/departments/createDepartment');
const updateProfile = require('../controllers/user/updateProfile');
const getUsersByDepartment = require('../controllers/user/getUsersByDepartment');
const moveDepartment = require('../controllers/user/moveDepartment');
const getUserByEmail = require('../controllers/user/getUserByEmail');
const updateStatus = require('../controllers/user/updateStatus');
const getAllUsers = require('../controllers/user/getAllUsers');





const { protect, isAdminOrBoss } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');






// ✅ Registrar usuarios (solo admin)
router.post('/register', protect, isAdmin, registerUser);
// 🚨 SOLO TEMPORAL
//router.post('/register', registerUser);


// ✅ Cambiar correo de cualquier usuario (solo admin)
router.put('/:id/email', protect, isAdmin, updateEmail);

// ✅ Cambiar contraseña de cualquier usuario (solo admin)
//router.put('/:id/password', protect, isAdmin, updatePassword);
router.put('/password/:id', protect, updatePassword);

// 🗑️ Eliminar usuario (solo admin, excepto admins)
//router.delete('/:id', protect, isAdmin, deleteUser);
router.delete('/by-data', protect, isAdmin, deleteUser);


// 🏢 Crear departamento (solo admin)
router.post('/departments', protect, isAdmin, createDepartment);
// ✏️ Editar nombre o rol (con control de permisos)
router.put('/:id/profile', protect, updateProfile);
//cualquier usuario puede ver todos los usuarios
router.get('/', protect, getAllUsers);
// 📋 Obtener usuarios por departamento (cualquier usuario)
router.get('/department/:id', protect, getUsersByDepartment);

router.put('/move-department/:userId', protect, isAdmin, moveDepartment);

router.post('/find-by-email', protect, getUserByEmail);

// ✅ Actualizar estado del usuario (solo admin)
//router.put('/:id/status', protect, isAdmin, updateStatus);
router.put('/:id/status', protect, isAdminOrBoss, updateStatus);









module.exports = router;
