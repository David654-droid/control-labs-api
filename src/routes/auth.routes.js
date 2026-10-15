const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Endpoint de login directo por rol (desarrollo y pruebas)
router.post('/login', AuthController.login);

// HU-01: Autenticación con Google (Gmail)
router.post('/google', AuthController.googleAuth);

// Perfil del usuario autenticado
router.get('/me', authenticateJWT, AuthController.getProfile);

// Lista de usuarios (Solo Rol ADMIN)
router.get('/users', authenticateJWT, authorizeRoles('ADMIN'), AuthController.listUsers);

module.exports = router;
