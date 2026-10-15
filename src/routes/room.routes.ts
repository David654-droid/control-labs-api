import { Router } from 'express';
import RoomController from '../controllers/room.controller';

const router = Router();

// Módulo 2: Gestión de Ambientes (Laboratorios / Salas)
router.get('/', RoomController.getRooms);
router.post('/', RoomController.createRoom);
router.get('/:id', RoomController.getRoomById);
router.patch('/:id', RoomController.updateRoomPartial); // Actualización parcial PATCH

export default router;
