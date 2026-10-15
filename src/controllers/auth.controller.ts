import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AuthController {
  /**
   * HU-01: Login institucional directo por rol (desarrollo y pruebas)
   * POST /api/v1/auth/login
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, role } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'El correo electrónico es obligatorio.',
        });
        return;
      }

      const result = await AuthService.login({ email, role });

      res.status(200).json({
        success: true,
        message: `Autenticación exitosa con rol ${result.user.role}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * HU-01: Autenticación con Google OAuth (Gmail Institucional)
   * POST /api/v1/auth/google
   */
  public static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, role } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'El correo de Google institucional es obligatorio.',
        });
        return;
      }

      const result = await AuthService.login({ email, role });

      res.status(200).json({
        success: true,
        message: 'Sesión institucional con Google iniciada exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar usuarios registrados (Solo ADMIN)
   * GET /api/v1/auth/users
   */
  public static async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AuthService.listUsers();
      res.status(200).json({
        success: true,
        total: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
