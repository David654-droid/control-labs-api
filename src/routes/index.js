const express = require('express');
const authRoutes = require('./auth.routes');
const loanRoutes = require('./loan.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

// Registro modular de rutas
router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
