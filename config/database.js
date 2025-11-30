const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database.db');

// Crear conexión a la base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Inicializar tablas
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Tabla de usuarios (administradores)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear tabla users:', err.message);
        reject(err);
      }
    });

    // Tabla de empleados
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        telefono TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        direccion TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear tabla employees:', err.message);
        reject(err);
      } else {
        console.log('Tablas inicializadas correctamente');
        resolve();
      }
    });
  });
};

// Ejecutar inicialización
initDatabase();

module.exports = db;

