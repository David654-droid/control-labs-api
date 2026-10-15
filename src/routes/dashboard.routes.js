const express = require('express');
const DashboardController = require('../controllers/dashboard.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// HU-04: Dashboard de métricas en tiempo real (ADMIN, INSTRUCTOR, GUARDA)
router.get(
  '/metrics',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR', 'GUARDA'),
  DashboardController.getMetrics
);

module.exports = router;
