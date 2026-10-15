const express = require('express');
const cors = require('cors');
const config = require('./config/env.config');
const apiRoutes = require('./routes');
const logger = require('./middlewares/logger.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Middlewares globales
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(logger);

// Página de bienvenida / Root Check
app.get('/', (req, res) => {
  res.status(200).json({
    nombre: 'SENA ControlLabs API',
    modulo: 'Sesión 1 - Express.js, Clean Architecture & .env',
    version: '1.0.0',
    documentacion: {
      healthCheck: '/api/v1/health',
      auth: '/api/v1/auth',
      loans: '/api/v1/loans',
      dashboard: '/api/v1/dashboard'
    },
    estado: 'Operativo'
  });
});

// Health Check Endpoint (requerido en la Sesión 1)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Enrutador principal de la API REST
app.use('/api/v1', apiRoutes);

// Manejo de ruta no encontrada (404)
app.use(notFoundHandler);

// Middleware centralizado de errores (500)
app.use(errorHandler);

module.exports = app;
