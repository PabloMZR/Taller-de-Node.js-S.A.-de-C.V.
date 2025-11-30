const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    // Validar y sanitizar entrada
    const username = req.body.username?.trim();
    const password = req.body.password;

    // Validar que se proporcionen username y password
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Validar longitud mínima
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'El usuario debe tener entre 3 y 50 caracteres'
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario en la base de datos
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    // Verificar contraseña
    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno en el login'
    });
  }
});

module.exports = router;

