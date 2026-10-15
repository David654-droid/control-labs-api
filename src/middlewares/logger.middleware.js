/**
 * Middleware de logging para registrar cada petición HTTP entrante en la consola
 */

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  
  console.log(`[${timestamp}] 📡 ${method} ${url} - IP: ${req.ip || '127.0.0.1'}`);
  next();
};

module.exports = logger;
