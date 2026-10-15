import { Router } from 'express';
import loanRoutes from './loan.routes';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Rutas integrales del Sistema ControlLabs
router.use('/loans', loanRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
