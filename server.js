require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

// Importar configuración de base de datos (para inicializar)
require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Gestión de Empleados',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login'
      },
      employees: {
        getAll: 'GET /api/employees',
        getById: 'GET /api/employees/:id',
        search: 'GET /api/employees/search?name=nombre',
        create: 'POST /api/employees',
        update: 'PUT /api/employees/:id',
        delete: 'DELETE /api/employees/:id'
      }
    },
    note: 'Todas las rutas de empleados requieren autenticación JWT'
  });
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Ruta raíz - redirigir al login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;

