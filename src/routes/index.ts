import { Router } from 'express';
import loanRoutes from './loan.routes';

const router = Router();

// Agrupador modular de recursos bajo prefijo /loans
router.use('/loans', loanRoutes);

export default router;
