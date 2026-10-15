/**
 * Middleware centralizado para manejo de errores de Express
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error capturado en el servidor:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor en ControlLabs API';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada en el servidor: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
