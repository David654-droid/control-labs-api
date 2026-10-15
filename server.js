require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/env.config');

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor ControlLabs corriendo en http://localhost:${PORT}`);
  console.log(`📡 Entorno: ${config.nodeEnv}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log('====================================================');
});

// Manejo de apagado elegante (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida. Cerrando servidor ControlLabs...');
  server.close(() => {
    console.log('🔒 Servidor cerrado con éxito.');
  });
});

module.exports = server;
