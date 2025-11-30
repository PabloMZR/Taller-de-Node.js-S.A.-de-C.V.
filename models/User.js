const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Buscar usuario por username
  static findByUsername(username, callback) {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      callback
    );
  }

  // Buscar usuario por ID
  static findById(id, callback) {
    db.get(
      'SELECT id, username, created_at FROM users WHERE id = ?',
      [id],
      callback
    );
  }

  // Crear nuevo usuario
  static create(username, password, callback) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }

      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, { id: this.lastID, username });
        }
      );
    });
  }

  // Verificar contraseña
  static verifyPassword(password, hashedPassword, callback) {
    bcrypt.compare(password, hashedPassword, callback);
  }

  // Obtener todos los usuarios (solo para administración)
  static getAll(callback) {
    db.all(
      'SELECT id, username, created_at FROM users',
      callback
    );
  }
}

module.exports = User;

