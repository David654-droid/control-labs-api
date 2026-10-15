const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * Endpoint de login simulado para testing rápido por roles (ADMIN, GUARDA, INSTRUCTOR)
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, role } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico es obligatorio.',
        });
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
   * HU-01: Autenticación con Google (Gmail)
   * POST /api/v1/auth/google
   */
  static async googleAuth(req, res, next) {
    try {
      const { googleToken, email, name, avatar } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Debe suministrar la información del usuario autenticado con Google.',
        });
      }

      const result = await AuthService.googleAuth({ googleToken, email, name, avatar });

      res.status(200).json({
        success: true,
        message: 'Sesión institucional iniciada correctamente mediante Google OAuth.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado actual
   * GET /api/v1/auth/me
   */
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar todos los usuarios del sistema (exclusivo para ADMIN)
   * GET /api/v1/auth/users
   */
  static async listUsers(req, res, next) {
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

module.exports = AuthController;
