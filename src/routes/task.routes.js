const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const createTask = require('../controllers/tasks/createTask');
const completeTask = require('../controllers/tasks/completeTask');
const getTaskById = require('../controllers/tasks/getTaskById');
const getTasksByUser = require('../controllers/tasks/getTasksByUser');

const updateTask = require('../controllers/tasks/updateTask');
const getTasksByDepartmentInRange = require('../controllers/user/getTasksByDepartmentInRange');
const getHistoricalTasks = require('../controllers/tasks/getHistoricalTasks');
const deletePendingTask = require('../controllers/tasks/deletePendingTask');
const eliminarTareaPendiente = require('../controllers/tasks/eliminarTareaPendiente');




const { protect } = require('../middleware/authMiddleware');
const { isAdminOrBoss, isAdmin } = require('../middleware/roleMiddleware');

// 📌 Crear tarea
router.post('/', protect, isAdminOrBoss, createTask);

// 📜 Obtener tareas del departamento Histórico (solo admin o jefe)
router.get('/historical', protect, getHistoricalTasks);

// 📊 Listar tareas por departamento en rango de fechas
router.get('/by-department/:departmentId', protect, isAdminOrBoss, getTasksByDepartmentInRange);

// ✅ Listar tareas por ID de usuario
router.get('/user/:id', protect, getTasksByUser);

// ✅ Ver tarea por ID (esto siempre debe ir después de las rutas más específicas)
router.get('/:id', protect, getTaskById);

// ✅ Completar tarea con imágenes y texto
router.put('/:id/complete', protect, upload.array('images', 4), completeTask);

// ✅ Actualizar tarea
router.put('/:id', protect, updateTask);

// 🗑️ Eliminar tarea pendiente (solo quien la asignó)
router.delete('/pending/:id', protect, deletePendingTask);

router.get('/assigned-by-me', protect, isAdminOrBoss, eliminarTareaPendiente);


module.exports = router;










