const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Buscar usuario por username
  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0] || null;
  }

  // Buscar usuario por ID
  static async findById(id) {
    const { rows } = await pool.query('SELECT id, username, created_at FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  // Crear nuevo usuario
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    return result.rows[0];
  }

  // Verificar contraseña
  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Obtener todos los usuarios (solo para administración)
  static async getAll() {
    const { rows } = await pool.query('SELECT id, username, created_at FROM users');
    return rows;
  }
}

module.exports = User;

