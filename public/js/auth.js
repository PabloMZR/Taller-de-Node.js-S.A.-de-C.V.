// API Base URL
const API_BASE_URL = '/api';

// Función para obtener el token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Función para guardar el token en localStorage
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Función para eliminar el token
function removeToken() {
    localStorage.removeItem('token');
}

// Función para obtener información del usuario
function getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

// Función para guardar información del usuario
function saveUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return getToken() !== null;
}

// Función para hacer peticiones autenticadas
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        // Si el token es inválido o expiró, redirigir al login
        if (response.status === 401 || response.status === 403) {
            removeToken();
            if (window.location.pathname !== '/login.html') {
                window.location.href = '/login.html';
            }
            return null;
        }
        
        return { response, data };
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Manejo del formulario de login
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoader = document.getElementById('loginBtnLoader');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Mostrar loading
        loginBtnText.style.display = 'none';
        loginBtnLoader.style.display = 'inline-block';
        errorMessage.style.display = 'none';
        loginForm.querySelector('button').disabled = true;
        
        try {
            const result = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (result && result.data.success) {
                saveToken(result.data.token);
                saveUserInfo(result.data.user);
                window.location.href = '/index.html';
            } else {
                errorMessage.textContent = result?.data?.message || 'Error al iniciar sesión';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Error de conexión. Por favor, intenta nuevamente.';
            errorMessage.style.display = 'block';
        } finally {
            loginBtnText.style.display = 'inline';
            loginBtnLoader.style.display = 'none';
            loginForm.querySelector('button').disabled = false;
        }
    });
}

// Manejo del botón de logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            removeToken();
            localStorage.removeItem('userInfo');
            window.location.href = '/login.html';
        }
    });
}

// Verificar autenticación en páginas protegidas
if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    } else {
        // Mostrar información del usuario
        const userInfo = getUserInfo();
        if (userInfo && document.getElementById('userInfo')) {
            document.getElementById('userInfo').textContent = `Usuario: ${userInfo.username}`;
        }
    }
}

// Redirigir al index si ya está autenticado y está en login
if (window.location.pathname === '/login.html' && isAuthenticated()) {
    window.location.href = '/index.html';
}

