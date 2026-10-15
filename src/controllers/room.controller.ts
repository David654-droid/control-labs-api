import { Request, Response } from 'express';
import { rooms } from '../config/dataStore';
import Room, { RoomStatus } from '../models/Room';

export class RoomController {
  /**
   * 1. Listar todos los espacios físicos y laboratorios de ControlLabs
   * GET /api/v1/rooms
   */
  public static getRooms = (req: Request, res: Response): void => {
    const { status, location } = req.query;
    let list = [...rooms];

    if (status) {
      list = list.filter((r) => r.status === status);
    }

    if (location) {
      list = list.filter((r) => r.location.toLowerCase().includes(String(location).toLowerCase()));
    }

    res.status(200).json({
      success: true,
      total: list.length,
      data: list,
    });
  };

  /**
   * 2. Crear un nuevo ambiente especificando su capacidad y ubicación
   * POST /api/v1/rooms
   */
  public static createRoom = (req: Request, res: Response): void => {
    const { name, capacity, location, status } = req.body;

    if (!name || capacity === undefined || !location) {
      res.status(400).json({
        success: false,
        message: 'Los campos nombre, capacidad y ubicación son obligatorios para registrar un ambiente.',
      });
      return;
    }

    const newRoom = new Room({
      name,
      capacity,
      location,
      status: status || 'OPERATIVO',
    });

    rooms.push(newRoom);

    res.status(201).json({
      success: true,
      message: `Ambiente '${newRoom.name}' creado exitosamente con capacidad de ${newRoom.capacity} personas.`,
      data: newRoom,
    });
  };

  /**
   * Consultar detalle de un ambiente específico
   * GET /api/v1/rooms/:id
   */
  public static getRoomById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const room = rooms.find((r) => r.id === id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: `Ambiente con identificador '${id}' no encontrado.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  };

  /**
   * 3. Actualizar atributos específicos de un ambiente (ej. cambiar solo la capacidad o estado operativo) vía PATCH
   * PATCH /api/v1/rooms/:id
   */
  public static updateRoomPartial = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { capacity, status, location, name, availablePCs } = req.body;

    const room = rooms.find((r) => r.id === id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: `Ambiente con identificador '${id}' no encontrado para modificación PATCH.`,
      });
      return;
    }

    const modifiedFields: string[] = [];

    // Actualización parcial de capacidad
    if (capacity !== undefined) {
      room.capacity = Number(capacity);
      modifiedFields.push('capacity');
    }

    // Actualización parcial del estado operativo
    if (status !== undefined) {
      room.status = status as RoomStatus;
      modifiedFields.push('status');
    }

    // Actualización parcial de ubicación
    if (location !== undefined) {
      room.location = location;
      modifiedFields.push('location');
    }

    // Actualización parcial del nombre
    if (name !== undefined) {
      room.name = name;
      modifiedFields.push('name');
    }

    if (availablePCs !== undefined) {
      room.availablePCs = Number(availablePCs);
      modifiedFields.push('availablePCs');
    }

    room.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Ambiente '${id}' actualizado parcialmente de forma exitosa vía PATCH.`,
      atributosModificados: modifiedFields,
      data: room,
    });
  };
}

export default RoomController;
