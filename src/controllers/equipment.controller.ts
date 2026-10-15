import { Request, Response } from 'express';
import { equipments, rooms } from '../config/dataStore';
import Equipment, { TechnicalStatus, EquipmentType } from '../models/Equipment';

export class EquipmentController {
  /**
   * 1. Listar todos los equipos existentes o filtrar aquellos asignados a un ambiente específico
   * GET /api/v1/equipments?roomId=SALA-301 o ?technicalStatus=OPERATIVO
   */
  public static getEquipments = (req: Request, res: Response): void => {
    const { room, roomId, technicalStatus, type } = req.query;
    let list = [...equipments];

    // Filtro por ambiente vinculado (admite roomId o nombre de room)
    const targetRoom = (roomId || room) as string | undefined;
    if (targetRoom) {
      const roomQuery = targetRoom.toLowerCase().trim();
      list = list.filter(
        (eq) => eq.roomId.toLowerCase().includes(roomQuery) || eq.location.toLowerCase().includes(roomQuery)
      );
    }

    // Filtro por estado técnico
    if (technicalStatus) {
      list = list.filter((eq) => eq.technicalStatus === technicalStatus);
    }

    // Filtro por tipo de equipo
    if (type) {
      list = list.filter((eq) => eq.type === type);
    }

    res.status(200).json({
      success: true,
      total: list.length,
      data: list,
    });
  };

  /**
   * 2. Registrar un nuevo equipo vinculado a un ambiente de laboratorio
   * POST /api/v1/equipments
   */
  public static createEquipment = (req: Request, res: Response): void => {
    const { serial, brand, model, roomId, type, technicalStatus, location } = req.body;

    if (!serial || !brand || !roomId) {
      res.status(400).json({
        success: false,
        message: 'Los campos serial, marca (brand) y ambiente vinculado (roomId) son obligatorios.',
      });
      return;
    }

    // Verificar si el ambiente existe
    const ambienteValido = rooms.find((r) => r.id === roomId || r.name.toLowerCase() === roomId.toLowerCase());
    const finalRoomId = ambienteValido ? ambienteValido.id : roomId;

    const newEquipment = new Equipment({
      serial,
      brand,
      model,
      roomId: finalRoomId,
      type: type as EquipmentType,
      technicalStatus: (technicalStatus as TechnicalStatus) || 'OPERATIVO',
      location: location || (ambienteValido ? ambienteValido.name : 'Ubicación asignada'),
    });

    equipments.push(newEquipment);

    res.status(201).json({
      success: true,
      message: `Equipo ${newEquipment.brand} con serial '${newEquipment.serial}' registrado y vinculado al ambiente '${newEquipment.roomId}'.`,
      data: newEquipment,
    });
  };

  /**
   * Consultar un equipo por ID
   * GET /api/v1/equipments/:id
   */
  public static getEquipmentById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const equipment = equipments.find((eq) => eq.id === id || eq.serial === id);

    if (!equipment) {
      res.status(404).json({
        success: false,
        message: `Equipo con identificador o serial '${id}' no encontrado.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  };

  /**
   * 3. Actualizar de forma parcial el estado técnico de un equipo (ej. marcarlo como "EN_MANTENIMIENTO" o cambiar su ubicación) usando PATCH
   * PATCH /api/v1/equipments/:id
   */
  public static updateEquipmentPartial = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { technicalStatus, location, roomId, brand, model } = req.body;

    const equipment = equipments.find((eq) => eq.id === id || eq.serial === id);

    if (!equipment) {
      res.status(404).json({
        success: false,
        message: `Equipo con identificador o serial '${id}' no encontrado para modificación PATCH.`,
      });
      return;
    }

    const modifiedFields: string[] = [];

    // Actualización parcial de estado técnico (ej. EN_MANTENIMIENTO, OPERATIVO, DE_BAJA)
    if (technicalStatus !== undefined) {
      equipment.technicalStatus = technicalStatus as TechnicalStatus;
      modifiedFields.push('technicalStatus');
    }

    // Actualización parcial de ubicación física dentro de la sala
    if (location !== undefined) {
      equipment.location = location;
      modifiedFields.push('location');
    }

    // Actualización parcial de reasignación a otro ambiente / laboratorio
    if (roomId !== undefined) {
      equipment.roomId = roomId;
      modifiedFields.push('roomId');
    }

    if (brand !== undefined) {
      equipment.brand = brand;
      modifiedFields.push('brand');
    }

    if (model !== undefined) {
      equipment.model = model;
      modifiedFields.push('model');
    }

    equipment.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Equipo '${equipment.id}' actualizado parcialmente mediante PATCH.`,
      atributosModificados: modifiedFields,
      data: equipment,
    });
  };
}

export default EquipmentController;
