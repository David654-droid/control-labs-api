import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// HU-01: Login y Google OAuth
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleAuth);

// Gestión de usuarios institucional (ADMIN)
router.get('/users', authenticateJWT as any, authorizeRoles('ADMIN') as any, AuthController.listUsers as any);

export default router;
