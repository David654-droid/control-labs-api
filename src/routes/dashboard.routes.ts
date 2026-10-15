import { Router } from 'express';
import DashboardController from '../controllers/dashboard.controller';

const router = Router();

// HU-04: Dashboard de métricas en tiempo real
router.get('/metrics', DashboardController.getMetrics);

export default router;
