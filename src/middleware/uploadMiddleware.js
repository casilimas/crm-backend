

// ✅ src/middleware/uploadMiddleware.js (con multer 1.4.5-lts.1)
const multer = require('multer');

// Almacenamiento en memoria (ideal para entornos como Render)
const storage = multer.memoryStorage();

// Filtro para solo imágenes jpeg, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(file.originalname.toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
