const pool = require('../config/database');

class Employee {
  // Obtener todos los empleados
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    return rows;
  }

  // Buscar empleados por nombre
  static async searchByName(name) {
    const searchTerm = `%${name}%`;
    const { rows } = await pool.query(
      `SELECT * FROM employees 
       WHERE nombre ILIKE $1 OR apellidos ILIKE $2 
       ORDER BY nombre ASC`,
      [searchTerm, searchTerm]
    );
    return rows;
  }

  // Obtener empleado por ID
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    return rows[0] || null;
  }

  // Crear nuevo empleado
  static async create(employeeData) {
    const { nombre, apellidos, telefono, correo, direccion } = employeeData;
    const result = await pool.query(
      `INSERT INTO employees (nombre, apellidos, telefono, correo, direccion) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, apellidos, telefono, correo, direccion]
    );
    return Employee.findById(result.rows[0].id);
  }

  // Actualizar empleado
  static async update(id, employeeData) {
    const { nombre, apellidos, telefono, correo, direccion } = employeeData;
    await pool.query(
      `UPDATE employees 
       SET nombre = $1, apellidos = $2, telefono = $3, correo = $4, direccion = $5, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6`,
      [nombre, apellidos, telefono, correo, direccion, id]
    );
    return Employee.findById(id);
  }

  // Eliminar empleado
  static async delete(id) {
    const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    return { message: 'Empleado eliminado correctamente', deletedRows: result.rowCount };
  }
}

module.exports = Employee;

