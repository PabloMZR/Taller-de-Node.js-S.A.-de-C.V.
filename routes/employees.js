const express = require('express');
const Employee = require('../models/Employee');
const authenticateToken = require('../middleware/auth');
const { validateEmployee, validateId } = require('../utils/validators');
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/employees - Obtener todos los empleados
router.get('/', (req, res) => {
  Employee.getAll((err, employees) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener empleados',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  });
});

// GET /api/employees/search?name=nombre - Buscar empleados por nombre
router.get('/search', (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'El parámetro "name" es requerido'
    });
  }

  Employee.searchByName(name, (err, employees) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al buscar empleados',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });
  });
});

// GET /api/employees/:id - Obtener un empleado por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un número
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }

  Employee.findById(id, (err, employee) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener empleado',
        error: err.message
      });
    }

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
  });
});

// POST /api/employees - Crear nuevo empleado
router.post('/', (req, res) => {
  // Validar y sanitizar datos
  const validation = validateEmployee(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.errors[0] // Retornar el primer error
    });
  }

  Employee.create(
    validation.sanitized,
    (err, employee) => {
      if (err) {
        // Manejar error de duplicado de correo si existe constraint
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({
            success: false,
            message: 'Ya existe un empleado con este correo electrónico'
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Error al crear empleado',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Empleado creado exitosamente',
        data: employee
      });
    }
  );
});

// PUT /api/employees/:id - Actualizar empleado
router.put('/:id', (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un número
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }

  // Validar y sanitizar datos
  const validation = validateEmployee(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.errors[0] // Retornar el primer error
    });
  }

  // Verificar que el empleado existe
  Employee.findById(id, (err, existingEmployee) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar empleado',
        error: err.message
      });
    }

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Actualizar empleado
    Employee.update(
      id,
      validation.sanitized,
      (err, employee) => {
        if (err) {
          // Manejar error de duplicado de correo si existe constraint
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(409).json({
              success: false,
              message: 'Ya existe otro empleado con este correo electrónico'
            });
          }
          return res.status(500).json({
            success: false,
            message: 'Error al actualizar empleado',
            error: err.message
          });
        }

        res.json({
          success: true,
          message: 'Empleado actualizado exitosamente',
          data: employee
        });
      }
    );
  });
});

// DELETE /api/employees/:id - Eliminar empleado
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un número
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID debe ser un número válido'
    });
  }

  // Verificar que el empleado existe
  Employee.findById(id, (err, employee) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar empleado',
        error: err.message
      });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Eliminar empleado
    Employee.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar empleado',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Empleado eliminado exitosamente',
        data: result
      });
    });
  });
});

module.exports = router;

