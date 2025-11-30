const express = require('express');
const Employee = require('../models/Employee');
const authenticateToken = require('../middleware/auth');
const { validateEmployee, validateId } = require('../utils/validators');
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/employees - Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleados',
      error: err.message
    });
  }
});

// GET /api/employees/search?name=nombre - Buscar empleados por nombre
router.get('/search', async (req, res) => {
  const { name } = req.query;
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'El parámetro "name" es requerido'
    });
  }
  try {
    const employees = await Employee.searchByName(name);
    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar empleados',
      error: err.message
    });
  }
});

// GET /api/employees/:id - Obtener un empleado por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleado',
      error: err.message
    });
  }
});

// POST /api/employees - Crear nuevo empleado
router.post('/', async (req, res) => {
  const validation = validateEmployee(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.errors[0]
    });
  }
  try {
    const employee = await Employee.create(validation.sanitized);
    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: employee
    });
  } catch (err) {
    // Manejar error de duplicado de correo/email único
    if (err.message && err.message.includes('duplicate key value')) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un empleado con este correo electrónico'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear empleado',
      error: err.message
    });
  }
});

// PUT /api/employees/:id - Actualizar empleado
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }
  const validation = validateEmployee(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.errors[0]
    });
  }
  try {
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    const employee = await Employee.update(id, validation.sanitized);
    res.json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: employee
    });
  } catch (err) {
    if (err.message && err.message.includes('duplicate key value')) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro empleado con este correo electrónico'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar empleado',
      error: err.message
    });
  }
});

// DELETE /api/employees/:id - Eliminar empleado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    const result = await Employee.delete(id);
    res.json({
      success: true,
      message: 'Empleado eliminado exitosamente',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar empleado',
      error: err.message
    });
  }
});

module.exports = router;

