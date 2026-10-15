const express = require('express');
const LoanController = require('../controllers/loan.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { validateLoanCreation } = require('../middlewares/validator.middleware');

const router = express.Router();

// Catálogo de salas disponibles
router.get('/rooms', LoanController.getRooms);

// HU-04: Consulta de Historial con Filtros por Salón y Fechas
router.get(
  '/history',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR', 'GUARDA'),
  LoanController.getHistory
);

// Obtener préstamo por ID
router.get('/:id', authenticateJWT, LoanController.getById);

// HU-02: Registro de Préstamo de Sala (Exclusivo para Rol GUARDA y ADMIN)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('GUARDA', 'ADMIN'),
  validateLoanCreation,
  LoanController.createLoan
);

// HU-03: Aceptación de Inventario (Exclusivo para Rol INSTRUCTOR)
router.put(
  '/:id/accept',
  authenticateJWT,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  LoanController.acceptLoan
);

// Rechazo de préstamo con novedades (Exclusivo para Rol INSTRUCTOR)
router.put(
  '/:id/reject',
  authenticateJWT,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  LoanController.rejectLoan
);

module.exports = router;
