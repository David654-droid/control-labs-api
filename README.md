# 🏛️ ControlLabs API - SENA ADSO

API REST profesional desarrollada en **Node.js** con **Express.js** y **TypeScript**, aplicando **Clean Architecture** para la gestión y préstamo de salas de cómputo del SENA.

---

## 📋 Sesión 2: Enrutamiento Avanzado, Controladores y TypeScript

En esta sesión se establecen las dos capas iniciales de la API:
1. **Capa de Enrutamiento (`express.Router`)**:
   - `src/app.ts`: Punto central de Express que monta el agregador de rutas en `/api/v1`.
   - `src/routes/index.ts`: Enrutador principal que agrupa los módulos bajo `/loans`.
   - `src/routes/loan.routes.ts`: Enrutador modular que asocia los verbos HTTP (`GET`, `POST`, `PUT`) a sus correspondientes métodos en el controlador.
2. **Capa de Controladores (`LoanController`)**:
   - `src/controllers/loan.controller.ts`: Actúa como intermediario. Recibe la petición HTTP, lee parámetros (`req.params`), filtros de consulta (`req.query`) o cuerpo JSON (`req.body`), y responde de forma honesta con código **`501 Not Implemented`** indicando que la operación de negocio está señalada con un `TODO` para conectarse en las siguientes sesiones.

---

## 🏛️ Estructura del Proyecto

```
Actv 1/
├── .env                              # Variables de entorno locales
├── .env.example                      # Plantilla pública de variables de entorno
├── .gitignore                        # Exclusión de node_modules/, dist/ y .env
├── package.json                      # Dependencias y scripts (tsx, tsc)
├── tsconfig.json                     # Configuración del compilador TypeScript
├── server.ts                         # Punto de entrada HTTP y arranque del servidor
├── tests/
│   └── loan.routes.test.ts           # Suite de pruebas automatizadas con tsx
└── src/
    ├── app.ts                        # Configuración de Express, middlewares y /api/v1
    ├── controllers/
    │   └── loan.controller.ts        # Métodos controladores (501 Not Implemented)
    └── routes/
        ├── index.ts                  # Agregador de rutas modular
        └── loan.routes.ts            # Definición de endpoints de préstamos
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Instalación de Dependencias
```bash
npm install
```

### 2. Variables de Entorno (`.env`)
```env
PORT=3000
NODE_ENV=development
```

### 3. Scripts Disponibles

- **Modo Desarrollo (Recarga en caliente con tsx watch):**
  ```bash
  npm run dev
  ```

- **Compilar a JavaScript (Genera carpeta dist/):**
  ```bash
  npm run build
  ```

- **Modo Producción (Ejecuta dist compilado):**
  ```bash
  npm start
  ```

- **Ejecutar Suite de Pruebas Automatizadas:**
  ```bash
  npm test
  ```

---

## 📡 Endpoints Implementados (Sesión 2)

| Método | Endpoint | Parámetros / Body | Respuesta Temporal |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/health` | Ninguno | `200 OK` (Health Check) |
| **POST** | `/api/v1/loans` | `req.body` (Datos de préstamo) | `501 Not Implemented` |
| **GET** | `/api/v1/loans/search` | `req.query` (`room`, `startDate`, `endDate`) | `501 Not Implemented` |
| **GET** | `/api/v1/loans/:id` | `req.params.id` | `501 Not Implemented` |
| **PUT** | `/api/v1/loans/:id/accept` | `req.params.id` | `501 Not Implemented` |

---

## 🧪 Pruebas con Thunder Client / Postman

1. **POST** `http://localhost:3000/api/v1/loans`
   - **Headers**: `Content-Type: application/json`
   - **Body**:
     ```json
     {
       "aula": "Sala 302 TI",
       "numeroPC": 20,
       "mouse": 20,
       "teclados": 20,
       "nombreGuardaEntrega": "Ana Perez",
       "instructorRecibe": "Carlos Ruiz"
     }
     ```
   - **Status esperado**: `501 Not Implemented`

2. **GET** `http://localhost:3000/api/v1/loans/search?room=302&startDate=2026-10-01&endDate=2026-10-15`
   - **Status esperado**: `501 Not Implemented`

3. **GET** `http://localhost:3000/api/v1/loans/801`
   - **Status esperado**: `501 Not Implemented`

4. **PUT** `http://localhost:3000/api/v1/loans/801/accept`
   - **Status esperado**: `501 Not Implemented`

5. **GET** `http://localhost:3000/api/v1/health`
   - **Status esperado**: `200 OK`
