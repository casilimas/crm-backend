
const express = require('express');
const router = express.Router();

const createDepartment = require('../controllers/departments/createDepartment');
const getDepartments = require('../controllers/departments/getDepartments');
const deleteDepartment = require('../controllers/departments/deleteDepartment');





const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// 🏢 Crear un nuevo departamento (solo admin)
router.post('/create', protect, isAdmin, createDepartment);

// 📋 Obtener todos los departamentos (solo usuarios autenticados)
router.get('/', protect, getDepartments);

// ✅ Eliminar un departamento (solo admin)
router.delete('/:id', protect, isAdmin, deleteDepartment);

module.exports = router;
