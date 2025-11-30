# Sistema de Gestión de Empleados - Recursos Humanos

Sistema web completo para el departamento de Recursos Humanos de Taller de Node.js S.A. de C.V.

## Características

- API RESTful con Express.js
- Autenticación JWT
- CRUD completo de empleados
- Búsqueda de empleados por nombre
- Interfaz de usuario amigable
- Base de datos SQLite

## Requisitos

- Node.js 
- npm

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura tu `JWT_SECRET`.

3. Inicializar la base de datos:
```bash
npm run init-db
```

Esto creará un usuario administrador por defecto:
- **Usuario:** admin
- **Contraseña:** admin123

4. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
proyecto-api/
├── server.js              # Servidor principal
├── config/
│   └── database.js        # Configuración de base de datos
├── models/
│   ├── User.js           # Modelo de usuario
│   └── Employee.js       # Modelo de empleado
├── routes/
│   ├── auth.js           # Rutas de autenticación
│   └── employees.js      # Rutas de empleados
├── middleware/
│   └── auth.js           # Middleware de autenticación JWT
├── scripts/
│   └── initDatabase.js   # Script de inicialización
└── public/               # Archivos estáticos (frontend)
    ├── index.html
    ├── login.html
    ├── css/
    └── js/
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Empleados (requiere autenticación)

- `GET /api/employees` - Obtener todos los empleados
- `GET /api/employees/search?name=nombre` - Buscar empleados por nombre
- `POST /api/employees` - Crear nuevo empleado
- `PUT /api/employees/:id` - Actualizar empleado
- `DELETE /api/employees/:id` - Eliminar empleado

## Uso

1. Accede a `http://localhost:3000`
2. Inicia sesión con las credenciales del administrador
3. Gestiona los empleados desde la interfaz web

## Tecnologías

- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (hash de contraseñas)

