const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores' });
  }
  next();
};

const isAdminOrBoss = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'jefe') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso restringido a administradores o jefes' });
};

module.exports = {
  isAdmin,
  isAdminOrBoss
};
