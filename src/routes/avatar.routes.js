const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadAvatar = require('../controllers/avatar/uploadAvatar');
const removeAvatar = require('../controllers/user/removeAvatar');



router.delete('/avatar', protect, removeAvatar);
// 📤 Ruta para subir o reemplazar el avatar
router.put('/avatar', protect, upload.single('image'), uploadAvatar);

module.exports = router;
