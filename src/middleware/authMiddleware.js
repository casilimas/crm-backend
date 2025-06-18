/*
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { protect };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
};

module.exports = { protect };
*/

// 📁 src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Middleware para proteger rutas con JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
};

// 🛡️ Middleware para verificar si es admin o jefe
const isAdminOrBoss = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'jefe')) {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado: solo admins o jefes' });
  }
};

module.exports = { protect, isAdminOrBoss };
