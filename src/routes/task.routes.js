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
const publicarTareaEnMuro = require('../controllers/tasks/finalizaPublicarTarea');
const getPublishedTasks = require('../controllers/tasks/getPublishedTasks');





const { protect } = require('../middleware/authMiddleware');
const { isAdminOrBoss, isAdmin } = require('../middleware/roleMiddleware');

// 📌 Crear tarea
router.post('/', protect, isAdminOrBoss, createTask);

// 📜 Obtener tareas del departamento Histórico (solo admin o jefe)
router.get('/historical', protect, getHistoricalTasks);

// 📊 Listar tareas por departamento en rango de fechas
router.get('/by-department/:departmentId', protect, isAdminOrBoss, getTasksByDepartmentInRange);


// ✅ Obtener tareas publicadas (para el muro) — DEBE IR ANTES DE `/:id`
router.get('/published', protect, getPublishedTasks);




// ✅ Listar tareas por ID de usuario
router.get('/user/:id', protect, getTasksByUser);



// ✅ Completar tarea con imágenes y texto
router.put('/:id/complete', protect, upload.array('images', 4), completeTask);

// ✅ Publicar tarea en el muro 
router.put('/:id/publish', protect, publicarTareaEnMuro);


// ✅ Actualizar tarea
router.put('/:id', protect, updateTask);

// 🗑️ Eliminar tarea pendiente (solo quien la asignó)
router.delete('/pending/:id', protect, deletePendingTask);

router.get('/assigned-by-me', protect, isAdminOrBoss, eliminarTareaPendiente);


// ✅ Ver tarea por ID (esto siempre debe ir después de las rutas más específicas)
router.get('/:id', protect, getTaskById);


module.exports = router;










