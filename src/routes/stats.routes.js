const express = require('express');
const router = express.Router();

const getUserStats = require('../controllers/stats/getUserStats');
const { protect, isAdminOrBoss } = require('../middleware/authMiddleware');

// 📊 Ruta protegida para estadísticas de usuario
router.get('/user/:userId', protect, isAdminOrBoss, getUserStats);

module.exports = router;
