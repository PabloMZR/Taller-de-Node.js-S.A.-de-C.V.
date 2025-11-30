const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    // Verificar que el usuario aún existe
    User.findById(decoded.userId, (err, user) => {
      if (err || !user) {
        return res.status(403).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      req.user = {
        id: decoded.userId,
        username: decoded.username
      };
      next();
    });
  });
};

module.exports = authenticateToken;

