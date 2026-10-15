import { Router } from 'express';
import loanRoutes from './loan.routes';
import userRoutes from './user.routes';
import roomRoutes from './room.routes';
import equipmentRoutes from './equipment.routes';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Módulos del Taller de Arquitectura REST en TypeScript (ControlLabs)
router.use('/users', userRoutes);             // 1. Gestión de Usuarios
router.use('/rooms', roomRoutes);             // 2. Gestión de Ambientes (Laboratorios / Salas)
router.use('/equipments', equipmentRoutes);   // 3. Gestión de Equipos (Hardware / Activos)

// Módulos base de ControlLabs
router.use('/loans', loanRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
