// Variables globales
let employees = [];
let currentEmployeeId = null;
let isSearchMode = false;

// Elementos del DOM
const employeesTableBody = document.getElementById('employeesTableBody');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const messageContainer = document.getElementById('messageContainer');

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Botón agregar empleado
    addEmployeeBtn.addEventListener('click', () => {
        openEmployeeModal();
    });
    
    // Búsqueda
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchEmployees(searchTerm);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchEmployees(searchTerm);
            }
        }
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        isSearchMode = false;
        loadEmployees();
    });
    
    // Modal de empleado
    document.getElementById('closeModal').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeEmployeeModal);
    
    employeeForm.addEventListener('submit', handleEmployeeSubmit);
    
    // Modal de eliminación
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Cerrar modales al hacer clic fuera
    employeeModal.addEventListener('click', (e) => {
        if (e.target === employeeModal) {
            closeEmployeeModal();
        }
    });
    
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// Cargar todos los empleados
async function loadEmployees() {
    try {
        showLoading();
        const result = await apiRequest('/employees');
        
        if (result && result.data.success) {
            employees = result.data.data;
            renderEmployees(employees);
        } else {
            showMessage('Error al cargar empleados', 'error');
            renderEmployees([]);
        }
    } catch (error) {
        showMessage('Error de conexión al cargar empleados', 'error');
        renderEmployees([]);
    }
}

// Buscar empleados por nombre
async function searchEmployees(name) {
    try {
        showLoading();
        const result = await apiRequest(`/employees/search?name=${encodeURIComponent(name)}`);
        
        if (result && result.data.success) {
            employees = result.data.data;
            renderEmployees(employees);
            isSearchMode = true;
            clearSearchBtn.style.display = 'inline-block';
            // Mostrar mensaje especial si no se encontraron resultados en búsqueda
            if (employees.length === 0) {
                showMessage('No se encontraron coincidencias', 'success');
            } else {
                showMessage(`Se encontraron ${employees.length} empleado(s)`, 'success');
            }
        } else {
            showMessage('Error al buscar empleados', 'error');
            renderEmployees([]);
        }
    } catch (error) {
        showMessage('Error de conexión al buscar empleados', 'error');
        renderEmployees([]);
    }
}

// Renderizar empleados en la tabla
function renderEmployees(employeesList) {
    if (employeesList.length === 0) {
        const emptyText = isSearchMode ? 'No se encontraron coincidencias' : 'No se encontraron empleados';
        employeesTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">${emptyText}</td>
            </tr>
        `;
        return;
    }
    
    employeesTableBody.innerHTML = employeesList.map(employee => `
        <tr>
            <td>${employee.id}</td>
            <td>${escapeHtml(employee.nombre)}</td>
            <td>${escapeHtml(employee.apellidos)}</td>
            <td>${escapeHtml(employee.telefono)}</td>
            <td>${escapeHtml(employee.correo)}</td>
            <td>${escapeHtml(employee.direccion)}</td>
            <td class="actions-cell">
                <button class="btn btn-primary btn-icon" onclick="editEmployee(${employee.id})">
                    Editar
                </button>
                <button class="btn btn-danger btn-icon" onclick="deleteEmployee(${employee.id}, '${escapeHtml(employee.nombre)} ${escapeHtml(employee.apellidos)}')">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

// Mostrar loading
function showLoading() {
    employeesTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading">Cargando empleados...</td>
        </tr>
    `;
}

// Abrir modal para agregar empleado
function openEmployeeModal(employee = null) {
    currentEmployeeId = null;
    employeeForm.reset();
    document.getElementById('modalTitle').textContent = 'Agregar Empleado';
    document.getElementById('employeeId').value = '';
    
    if (employee) {
        currentEmployeeId = employee.id;
        document.getElementById('modalTitle').textContent = 'Editar Empleado';
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('nombre').value = employee.nombre;
        document.getElementById('apellidos').value = employee.apellidos;
        document.getElementById('telefono').value = employee.telefono;
        document.getElementById('correo').value = employee.correo;
        document.getElementById('direccion').value = employee.direccion;
    }
    
    employeeModal.classList.add('show');
}

// Cerrar modal de empleado
function closeEmployeeModal() {
    employeeModal.classList.remove('show');
    employeeForm.reset();
    currentEmployeeId = null;
}

// Editar empleado
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        openEmployeeModal(employee);
    }
}

// Eliminar empleado
function deleteEmployee(id, name) {
    currentEmployeeId = id;
    document.getElementById('deleteEmployeeName').textContent = name;
    deleteModal.classList.add('show');
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    deleteModal.classList.remove('show');
    currentEmployeeId = null;
}

// Confirmar eliminación
async function confirmDelete() {
    if (!currentEmployeeId) return;
    
    try {
        const result = await apiRequest(`/employees/${currentEmployeeId}`, {
            method: 'DELETE'
        });
        
        if (result && result.data.success) {
            showMessage('Empleado eliminado exitosamente', 'success');
            closeDeleteModal();
            if (isSearchMode) {
                // Si estamos en modo búsqueda, recargar la búsqueda
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    searchEmployees(searchTerm);
                } else {
                    loadEmployees();
                }
            } else {
                loadEmployees();
            }
        } else {
            showMessage(result?.data?.message || 'Error al eliminar empleado', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión al eliminar empleado', 'error');
    }
}

// Manejar envío del formulario
async function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };
    
    // Validación básica
    if (!formData.nombre || !formData.apellidos || !formData.telefono || !formData.correo || !formData.direccion) {
        showMessage('Todos los campos son requeridos', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    
    try {
        let result;
        if (currentEmployeeId) {
            // Actualizar
            result = await apiRequest(`/employees/${currentEmployeeId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
        } else {
            // Crear
            result = await apiRequest('/employees', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
        }
        
        if (result && result.data.success) {
            showMessage(
                currentEmployeeId ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente',
                'success'
            );
            closeEmployeeModal();
            if (isSearchMode) {
                loadEmployees();
                isSearchMode = false;
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
            } else {
                loadEmployees();
            }
        } else {
            showMessage(result?.data?.message || 'Error al guardar empleado', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión al guardar empleado', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Mostrar mensaje
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 500);
    }, 5000);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

