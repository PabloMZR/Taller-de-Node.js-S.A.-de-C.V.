const { Pool } = require('pg');
require('dotenv').config();

// Configuración para conexión PostgreSQL, adaptable a Azure
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'proyectoapi',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false // útil para cloud
});

// Inicializar tablas en PostgreSQL
const initDatabase = async () => {
  try {
    // Tabla de usuarios (administradores)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de empleados
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        telefono TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        direccion TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tablas inicializadas correctamente en PostgreSQL');
  } catch (err) {
    console.error('Error al crear tablas:', err);
    process.exit(1);
  }
};

// Ejecutar inicialización
initDatabase();

module.exports = pool;

