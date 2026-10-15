import { Request, Response } from 'express';
import { users } from '../config/dataStore';
import User, { UserRole, AccountStatus } from '../models/User';

export class UserController {
  /**
   * 1. Obtener el listado completo de usuarios registrados en el sistema
   * GET /api/v1/users
   */
  public static getUsers = (req: Request, res: Response): void => {
    // Si se pasa query ?status=ACTIVO, filtra por estado
    const { status } = req.query;
    let list = [...users];

    if (status) {
      list = list.filter((u) => u.status === status);
    }

    res.status(200).json({
      success: true,
      total: list.length,
      data: list,
    });
  };

  /**
   * 2. Registrar un nuevo perfil de usuario (estudiante, docente, administrador)
   * POST /api/v1/users
   */
  public static createUser = (req: Request, res: Response): void => {
    const { name, email, role, password, documentNumber, phone } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: 'Los campos nombre y correo electrónico son obligatorios.',
      });
      return;
    }

    const emailExistente = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExistente) {
      res.status(409).json({
        success: false,
        message: `El correo ${email} ya se encuentra registrado en el sistema.`,
      });
      return;
    }

    const validRoles: UserRole[] = ['estudiante', 'docente', 'administrador', 'ADMIN', 'GUARDA', 'INSTRUCTOR'];
    const assignedRole: UserRole = validRoles.includes(role) ? role : 'estudiante';

    const newUser = new User({
      name,
      email,
      role: assignedRole,
      password,
      documentNumber,
      phone,
      status: 'ACTIVO',
    });

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: `Usuario registrado exitosamente con perfil '${newUser.role}'.`,
      data: newUser,
    });
  };

  /**
   * 3. Consultar los detalles de un usuario específico mediante su identificador único
   * GET /api/v1/users/:id
   */
  public static getUserById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: `Usuario con identificador '${id}' no encontrado.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * 4. Actualizar parcialmente el rol, estado de cuenta o contraseña de un usuario específico (PATCH)
   * PATCH /api/v1/users/:id
   */
  public static updateUserPartial = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { role, status, password, phone, name } = req.body;

    const user = users.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: `Usuario con identificador '${id}' no encontrado para actualización parcial.`,
      });
      return;
    }

    // Actualización parcial (solo de los campos presentes en req.body)
    const modifiedFields: string[] = [];

    if (role !== undefined) {
      user.role = role;
      modifiedFields.push('role');
    }

    if (status !== undefined) {
      user.status = status as AccountStatus;
      modifiedFields.push('status');
    }

    if (password !== undefined) {
      user.password = password;
      modifiedFields.push('password');
    }

    if (phone !== undefined) {
      user.phone = phone;
      modifiedFields.push('phone');
    }

    if (name !== undefined) {
      user.name = name;
      modifiedFields.push('name');
    }

    user.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Usuario '${id}' actualizado parcialmente con éxito.`,
      camposActualizados: modifiedFields,
      data: user,
    });
  };

  /**
   * 5. Eliminar lógicamente un usuario del sistema
   * DELETE /api/v1/users/:id
   */
  public static deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: `Usuario con identificador '${id}' no encontrado.`,
      });
      return;
    }

    // Eliminación lógica (soft delete) marcando el estado en 'INACTIVO'
    user.status = 'INACTIVO';
    user.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Usuario '${id}' ha sido eliminado lógicamente del sistema (estado: INACTIVO).`,
      data: user,
    });
  };
}

export default UserController;
