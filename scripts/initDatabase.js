require('dotenv').config();
const db = require('../config/database');
const User = require('../models/User');

// Esperar a que la base de datos se inicialice
setTimeout(() => {
  // Verificar si ya existe un usuario admin
  User.findByUsername('admin', (err, existingUser) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      process.exit(1);
    }

    if (existingUser) {
      console.log('Usuario administrador ya existe');
      console.log('   Usuario: admin');
      console.log('   (Si necesitas cambiar la contraseña, elimina el usuario y ejecuta este script nuevamente)');
      process.exit(0);
    }

    // Crear usuario administrador por defecto
    User.create('admin', 'admin123', (err, user) => {
      if (err) {
        console.error(' Error al crear usuario administrador:', err);
        process.exit(1);
      }

      console.log(' Usuario administrador creado exitosamente');
      console.log('   Usuario: admin');
      console.log('   Contraseña: admin123');
      console.log('');
      console.log('  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
      process.exit(0);
    });
  });
}, 1000);

