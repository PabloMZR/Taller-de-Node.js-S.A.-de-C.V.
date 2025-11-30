const db = require('../config/database');

class Employee {
  // Obtener todos los empleados
  static getAll(callback) {
    db.all(
      'SELECT * FROM employees ORDER BY created_at DESC',
      callback
    );
  }

  // Buscar empleados por nombre
  static searchByName(name, callback) {
    const searchTerm = `%${name}%`;
    db.all(
      `SELECT * FROM employees 
       WHERE nombre LIKE ? OR apellidos LIKE ? 
       ORDER BY nombre ASC`,
      [searchTerm, searchTerm],
      callback
    );
  }

  // Obtener empleado por ID
  static findById(id, callback) {
    db.get(
      'SELECT * FROM employees WHERE id = ?',
      [id],
      callback
    );
  }

  // Crear nuevo empleado
  static create(employeeData, callback) {
    const { nombre, apellidos, telefono, correo, direccion } = employeeData;
    
    db.run(
      `INSERT INTO employees (nombre, apellidos, telefono, correo, direccion) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellidos, telefono, correo, direccion],
      function(err) {
        if (err) {
          return callback(err);
        }
        // Retornar el empleado creado
        Employee.findById(this.lastID, (err, employee) => {
          if (err) {
            return callback(err);
          }
          callback(null, employee);
        });
      }
    );
  }

  // Actualizar empleado
  static update(id, employeeData, callback) {
    const { nombre, apellidos, telefono, correo, direccion } = employeeData;
    
    db.run(
      `UPDATE employees 
       SET nombre = ?, apellidos = ?, telefono = ?, correo = ?, direccion = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [nombre, apellidos, telefono, correo, direccion, id],
      function(err) {
        if (err) {
          return callback(err);
        }
        // Retornar el empleado actualizado
        Employee.findById(id, (err, employee) => {
          if (err) {
            return callback(err);
          }
          callback(null, employee);
        });
      }
    );
  }

  // Eliminar empleado
  static delete(id, callback) {
    db.run(
      'DELETE FROM employees WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, { message: 'Empleado eliminado correctamente', deletedRows: this.changes });
      }
    );
  }
}

module.exports = Employee;

