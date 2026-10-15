const LoanService = require('../services/loan.service');

class LoanController {
  /**
   * HU-02: Registro de préstamo de sala (Rol Guarda)
   * POST /api/v1/loans
   */
  static async createLoan(req, res, next) {
    try {
      const loan = await LoanService.createLoan(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Préstamo de sala registrado exitosamente en estado PENDIENTE_APROBACION.',
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * HU-03: Aceptación de inventario (Rol Instructor)
   * PUT /api/v1/loans/:id/accept
   */
  static async acceptLoan(req, res, next) {
    try {
      const { id } = req.params;
      const { observaciones, firmaDigital } = req.body;

      const updatedLoan = await LoanService.acceptLoan(
        id,
        { observaciones, firmaDigital },
        req.user
      );

      res.status(200).json({
        success: true,
        message: 'Inventario físico aceptado y firmado satisfactoriamente por el instructor.',
        data: updatedLoan,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechazar entrega de sala por novedades físicas
   * PUT /api/v1/loans/:id/reject
   */
  static async rejectLoan(req, res, next) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const updatedLoan = await LoanService.rejectLoan(id, { motivo }, req.user);

      res.status(200).json({
        success: true,
        message: 'Entrega de inventario rechazada con novedades registradas.',
        data: updatedLoan,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * HU-04: Consulta de Historial con Filtros por Salón y Fechas
   * GET /api/v1/loans/history?room=302&startDate=2026-06-01&endDate=2026-06-30
   */
  static async getHistory(req, res, next) {
    try {
      const { room, startDate, endDate, status, limit, page } = req.query;

      const history = await LoanService.getHistory({
        room,
        startDate,
        endDate,
        status,
        limit,
        page,
      });

      res.status(200).json({
        success: true,
        message: 'Historial de préstamos consultado correctamente.',
        ...history,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener detalle de un préstamo por ID
   * GET /api/v1/loans/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const loan = await LoanService.getById(id);

      res.status(200).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener catálogo de salas disponibles
   * GET /api/v1/loans/rooms
   */
  static async getRooms(req, res, next) {
    try {
      const rooms = await LoanService.getAvailableRooms();

      res.status(200).json({
        success: true,
        total: rooms.length,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoanController;
