require('dotenv').config();
const User = require('../models/User');

(async () => {
  try {
    const existingUser = await User.findByUsername('admin');
    if (existingUser) {
      console.log('Usuario administrador ya existe');
      console.log('   Usuario: admin');
      console.log('   (Si necesitas cambiar la contraseña, elimina el usuario y ejecuta este script nuevamente)');
      process.exit(0);
    }
    // Crear usuario administrador por defecto
    const user = await User.create('admin', 'admin123');
    console.log(' Usuario administrador creado exitosamente');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    console.log('');
    console.log('  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
  } catch (err) {
    console.error('Error durante la inicialización de usuario admin:', err);
    process.exit(1);
  }
  process.exit(0);
})();

