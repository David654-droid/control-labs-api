import { Router } from 'express';
import EquipmentController from '../controllers/equipment.controller';

const router = Router();

// Módulo 3: Gestión de Equipos (Hardware / Activos)
router.get('/', EquipmentController.getEquipments);          // Listar o filtrar ?room=...
router.post('/', EquipmentController.createEquipment);       // Registrar equipo vinculado
router.get('/:id', EquipmentController.getEquipmentById);    // Consultar por ID o serial
router.patch('/:id', EquipmentController.updateEquipmentPartial); // Actualización técnica PATCH

export default router;
