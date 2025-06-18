const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');



const createComment = require('../controllers/comments/createComment');
const getCommentsByTask = require('../controllers/comments/getCommentsByTask');
const deleteComment = require('../controllers/comments/deleteComment');





// 📝 Crear comentario en una tarea completada
router.post('/:taskId', protect, createComment);

// 📋 Obtener comentarios de una tarea
router.get('/:taskId', protect, getCommentsByTask);

// 🗑️ Eliminar un comentario específico (solo admin)
router.delete('/:commentId', protect, isAdmin, deleteComment);


module.exports = router;





