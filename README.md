# 🏛️ ControlLabs API - SENA ADSO

API REST profesional desarrollada en **Node.js** con **Express.js** y **Arquitectura Limpia (Clean Architecture)** para la gestión y préstamo de salas de cómputo del SENA.

---

## 📋 Descripción del Sistema
ControlLabs soluciona la gestión de inventario y préstamo de ambientes de aprendizaje:
- **Autenticación Institucional Gmail**: Login seguro con Google OAuth y emisión de tokens **JWT**.
- **Control de Acceso basado en Roles (RBAC)**:
  - 👑 **ADMIN**: Gestión global, usuarios y auditoría.
  - 🛡️ **GUARDA**: Registro físico del préstamo diligenciando los 11 campos oficiales.
  - 👨‍🏫 **INSTRUCTOR**: Revisión del inventario y aceptación/firma a satisfacción.
- **Formato Físico SENA**: Registro de PCs, mouses, teclados, cargadores, TV, control, fechas, responsables y novedades.
- **Dashboard en Tiempo Real**: KPIs con porcentajes de ocupación de aulas, equipos activos y estados.
- **Historial Avanzado**: Búsqueda por salón y rangos de fechas.

---

## 🏛️ Estructura del Proyecto (Clean Architecture)

```
Actv 1/
├── .env                  # Variables de entorno locales (NO subir a Git)
├── .env.example          # Plantilla pública de variables de entorno
├── .gitignore            # Exclusión de node_modules y .env
├── package.json          # Metadatos, scripts y dependencias
├── server.js             # Punto de entrada HTTP y arranque del servidor
├── tests/
│   └── api.test.js       # Suite de pruebas automatizadas (Node.js test runner)
└── src/
    ├── app.js            # Configuración de Express, middlewares y rutas
    ├── config/
    │   ├── env.config.js # Configuración centralizada de variables de entorno
    │   └── dataStore.js  # Almacén de datos y catálogo de prueba
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── loan.controller.js
    │   └── dashboard.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js       # JWT & Control de Roles (RBAC)
    │   ├── error.middleware.js      # Manejo global de 404 y 500
    │   ├── logger.middleware.js     # Log de solicitudes HTTP
    │   └── validator.middleware.js  # Validación de los 11 campos SENA
    ├── models/
    │   ├── Loan.js                  # Modelo de Préstamo e Inventario
    │   └── User.js                  # Modelo de Usuario institucional
    ├── routes/
    │   ├── auth.routes.js
    │   ├── dashboard.routes.js
    │   ├── loan.routes.js
    │   └── index.js
    └── services/
        ├── auth.service.js          # Lógica de Google OAuth & JWT
        ├── dashboard.service.js     # Cálculo de KPIs en tiempo real
        └── loan.service.js          # Negocio de préstamos y filtros
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Prerrequisitos
- Node.js LTS (v18 o superior)
- npm

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea o edita el archivo `.env` en la raíz (puedes basarte en `.env.example`):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sena_controllabs_secret_key_adso_2026
JWT_EXPIRES_IN=24h
GOOGLE_CLIENT_ID=sena-controllabs-client-id
GOOGLE_CLIENT_SECRET=sena-controllabs-secret
ALLOWED_ORIGIN=*
```

### 4. Ejecución del Servidor

- **Modo Desarrollo (Recarga automática con Nodemon):**
  ```bash
  npm run dev
  ```

- **Modo Producción:**
  ```bash
  npm start
  ```

- **Ejecutar Suite de Pruebas Automatizadas:**
  ```bash
  npm test
  ```

---

## 📡 Endpoints de la API REST (`/api/v1`)

### 1. Verificación de Estado (Health Check)
- **`GET /api/v1/health`**
  - Respuesta: `200 OK` con estado del servidor.

### 2. Autenticación y Usuarios (HU-01)
- **`POST /api/v1/auth/google`**: Inicio de sesión con Google OAuth (Gmail institucional).
- **`POST /api/v1/auth/login`**: Login directo para pruebas de roles (`ADMIN`, `GUARDA`, `INSTRUCTOR`).
  ```json
  {
    "email": "carlos.guarda@seguridadsena.gov.co",
    "role": "GUARDA"
  }
  ```
- **`GET /api/v1/auth/me`**: Consulta de perfil autenticado (Bearer Token).
- **`GET /api/v1/auth/users`**: Listado de usuarios (Solo `ADMIN`).

### 3. Préstamos e Inventario Físico (HU-02 & HU-03)
- **`GET /api/v1/loans/rooms`**: Catálogo de aulas de cómputo disponibles.
- **`POST /api/v1/loans`** *(Solo GUARDA / ADMIN)*: Registra préstamo con los 11 campos oficiales:
  ```json
  {
    "aula": "Sala 302 TI",
    "numeroPC": 32,
    "mouse": 32,
    "teclados": 32,
    "cargador": 32,
    "fechaHoraRecibido": "2026-10-15T08:00:00.000Z",
    "numeroTVs": 1,
    "controlTV": true,
    "instructorRecibe": "sgomez@misena.edu.co",
    "telefono": "3205557890",
    "nombreGuardaEntrega": "Carlos Mendoza",
    "observaciones": "Entrega de aula en perfecto orden."
  }
  ```
- **`PUT /api/v1/loans/:id/accept`** *(Solo INSTRUCTOR)*: Aceptación y firma digital del inventario:
  ```json
  {
    "observaciones": "Inventario físico verificado a entera satisfacción.",
    "firmaDigital": "FIRMA_DIGITAL_INSTRUCTOR_SGOMEZ"
  }
  ```
- **`PUT /api/v1/loans/:id/reject`** *(Solo INSTRUCTOR)*: Rechazo por novedades físicas.

### 4. Consultas, Historial y Dashboard (HU-04)
- **`GET /api/v1/loans/history?room=302&startDate=2026-01-01&endDate=2026-12-31`**: Historial filtrado.
- **`GET /api/v1/dashboard/metrics`**: Indicadores y KPIs en tiempo real (Salas prestadas hoy, ocupación, pendientes por validar).

---

## 🛡️ Práctica Git ejecutada (Sesión 1)
```bash
git init
git branch -M main
git add .
git commit -m "feat(base): inicializa estructura base, variables .env y servidor Express para ControlLabs"
```
