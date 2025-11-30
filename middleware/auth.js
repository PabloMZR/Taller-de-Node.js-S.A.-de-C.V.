const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }
    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }
      try {
        const user = await User.findById(decoded.userId);
        if (!user) {
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
      } catch (modelErr) {
        return res.status(500).json({
          success: false,
          message: 'Error al verificar usuario',
          error: modelErr.message
        });
      }
    });
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el middleware de autenticación'
    });
  }
};

module.exports = authenticateToken;

