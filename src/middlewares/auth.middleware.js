const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const { users } = require('../config/dataStore');

/**
 * Middleware para autenticar token JWT en cabecera Authorization: Bearer <token>
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado. Debe proporcionar un token JWT válido con el formato: Bearer <token>',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Adjuntamos el usuario decodificado a la petición
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
      error: error.message,
    });
  }
};

/**
 * Middleware para autorización por roles (RBAC)
 * @param  {...string} allowedRoles - Lista de roles permitidos (ADMIN, GUARDA, INSTRUCTOR)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. No se encontró información de rol en la sesión.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso restringido. Su rol '${req.user.role}' no tiene permisos para esta acción. Roles permitidos: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
