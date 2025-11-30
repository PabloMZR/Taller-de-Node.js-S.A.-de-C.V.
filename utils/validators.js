// Utilidades de validación reutilizables

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida y sanitiza los datos de un empleado
 * @param {object} employeeData - Datos del empleado
 * @returns {object} - { isValid: boolean, errors: array, sanitized: object }
 */
function validateEmployee(employeeData) {
  const errors = [];
  
  // Sanitizar datos
  const nombre = employeeData.nombre?.trim();
  const apellidos = employeeData.apellidos?.trim();
  const telefono = employeeData.telefono?.trim();
  const correo = employeeData.correo?.trim();
  const direccion = employeeData.direccion?.trim();

  // Validar campos requeridos
  if (!nombre || !apellidos || !telefono || !correo || !direccion) {
    errors.push('Todos los campos son requeridos: nombre, apellidos, telefono, correo, direccion');
  }

  // Validar formato de email
  if (correo && !validateEmail(correo)) {
    errors.push('El formato del correo electrónico no es válido');
  }

  // Validar longitudes
  if (nombre && nombre.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }

  if (apellidos && apellidos.length > 100) {
    errors.push('Los apellidos no pueden exceder 100 caracteres');
  }

  if (telefono && telefono.length > 20) {
    errors.push('El teléfono no puede exceder 20 caracteres');
  }

  if (correo && correo.length > 255) {
    errors.push('El correo electrónico no puede exceder 255 caracteres');
  }

  if (direccion && direccion.length > 500) {
    errors.push('La dirección no puede exceder 500 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      nombre,
      apellidos,
      telefono,
      correo,
      direccion
    }
  };
}

/**
 * Valida un ID numérico
 * @param {string} id - ID a validar
 * @returns {boolean} - true si es válido, false si no
 */
function validateId(id) {
  return !isNaN(id) && parseInt(id) > 0;
}

module.exports = {
  validateEmail,
  validateEmployee,
  validateId
};

