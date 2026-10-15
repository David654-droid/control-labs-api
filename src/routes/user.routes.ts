import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

// Módulo 1: Gestión de Usuarios
router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.patch('/:id', UserController.updateUserPartial); // Actualización parcial PATCH
router.delete('/:id', UserController.deleteUser);       // Eliminación lógica

export default router;
