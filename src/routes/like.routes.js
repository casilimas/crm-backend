const express = require('express');
const router = express.Router();

const toggleLike = require('../controllers/likes/toggleLike');
const getLikes = require('../controllers/likes/getLikes');
const { protect } = require('../middleware/authMiddleware');

router.post('/likes/:taskId', protect, toggleLike);
router.get('/likes/:taskId', getLikes);

module.exports = router;
