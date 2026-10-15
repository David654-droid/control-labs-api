# 🏛️ ControlLabs API - SENA ADSO

API REST profesional desarrollada en **Node.js** con **Express.js** y **TypeScript**, aplicando **Clean Architecture** para la gestión de usuarios, ambientes y equipos del SENA.

---

## 🛠️ Taller de Arquitectura REST en TypeScript: Operaciones PATCH

Este taller implementa la arquitectura modular de rutas y controladores para tres recursos fundamentales de ControlLabs:

### 1. Módulo: Gestión de Usuarios (`/api/v1/users`)
* **`GET /api/v1/users`**: Listado completo de usuarios registrados.
* **`POST /api/v1/users`**: Registrar un nuevo perfil de usuario (`estudiante`, `docente`, `administrador`).
* **`GET /api/v1/users/:id`**: Consultar detalles de un usuario por su identificador único.
* **`PATCH /api/v1/users/:id`**: Actualización parcial del rol, estado de cuenta o contraseña vía **PATCH**.
* **`DELETE /api/v1/users/:id`**: Eliminación lógica del sistema (cambio de estado a `INACTIVO`).

### 2. Módulo: Gestión de Ambientes (`/api/v1/rooms`)
* **`GET /api/v1/rooms`**: Listar todos los espacios físicos y laboratorios.
* **`POST /api/v1/rooms`**: Crear un nuevo ambiente especificando su capacidad y ubicación.
* **`GET /api/v1/rooms/:id`**: Consultar un ambiente específico.
* **`PATCH /api/v1/rooms/:id`**: Actualización parcial de capacidad o estado operativo (`OPERATIVO`, `MANTENIMIENTO`) vía **PATCH**.

### 3. Módulo: Gestión de Equipos (`/api/v1/equipments`)
* **`POST /api/v1/equipments`**: Registrar un nuevo equipo vinculado a un ambiente de laboratorio.
* **`GET /api/v1/equipments`**: Listar todos los equipos existentes o filtrar con `?room=SALA-301`.
* **`GET /api/v1/equipments/:id`**: Consultar equipo por identificador o serial.
* **`PATCH /api/v1/equipments/:id`**: Actualización parcial del estado técnico (`OPERATIVO`, `EN_MANTENIMIENTO`, `DE_BAJA`) o reasignación de ubicación física vía **PATCH**.

---

## 🏛️ Estructura del Proyecto

```
Actv 1/
├── server.ts                         # Punto de entrada HTTP y arranque del servidor
├── tsconfig.json                     # Configuración de compilación ES2022 / CommonJS
├── thunder-collection_ControlLabs.json # Peticiones listas para Thunder Client (PATCH, GET, POST)
├── tests/
│   ├── taller.patch.test.ts          # Pruebas automatizadas de los 3 módulos (11 tests)
│   └── loan.routes.test.ts           # Pruebas de rutas de préstamos (5 tests)
└── src/
    ├── app.ts                        # Configuración de Express y montaje /api/v1
    ├── config/
    │   ├── env.config.ts             # Variables de entorno
    │   └── dataStore.ts              # Almacén de usuarios, ambientes y equipos
    ├── controllers/
    │   ├── user.controller.ts        # Controlador Usuarios (CRUD + PATCH + Baja Lógica)
    │   ├── room.controller.ts        # Controlador Ambientes (CRUD + PATCH)
    │   ├── equipment.controller.ts   # Controlador Equipos (CRUD + PATCH)
    │   ├── loan.controller.ts        # Controlador Préstamos
    │   ├── auth.controller.ts        # Controlador Autenticación
    │   └── dashboard.controller.ts   # Controlador Métricas
    ├── models/
    │   ├── User.ts                   # Modelo Usuario con perfiles
    │   ├── Room.ts                   # Modelo Ambiente / Laboratorio
    │   ├── Equipment.ts              # Modelo Equipo y Estado Técnico
    │   └── Loan.ts                   # Modelo Préstamo Físico SENA
    └── routes/
        ├── index.ts                  # Agregador central de rutas
        ├── user.routes.ts            # Rutas de Usuarios
        ├── room.routes.ts            # Rutas de Ambientes
        ├── equipment.routes.ts       # Rutas de Equipos
        ├── loan.routes.ts            # Rutas de Préstamos
        ├── auth.routes.ts            # Rutas de Autenticación
        └── dashboard.routes.ts       # Rutas de Dashboard
```

---

## ⚡ Comandos para Ejecución y Pruebas

```powershell
npm run dev           # Servidor en vivo con tsx watch (http://localhost:3000)
npm run build         # Compilación TypeScript limpia hacia dist/
npm test              # Ejecución de los 16 tests automatizados
npm run test:taller   # Ejecución exclusiva de los 11 tests del taller PATCH
```
