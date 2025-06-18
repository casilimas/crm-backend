// ✅ src/config/multer.js
const multer = require('multer');

// 🧠 Usa almacenamiento en memoria (ideal para subir a Cloudinary)
const storage = multer.memoryStorage();

// 📷 Filtro para imágenes válidas
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(file.originalname.toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
};

// 🚀 Exportar middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
