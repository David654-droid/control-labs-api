const DashboardService = require('../services/dashboard.service');

class DashboardController {
  /**
   * HU-04: Dashboard de métricas en tiempo real
   * GET /api/v1/dashboard/metrics
   */
  static async getMetrics(req, res, next) {
    try {
      const metrics = await DashboardService.getMetrics();

      res.status(200).json({
        success: true,
        message: 'Métricas del dashboard ControlLabs obtenidas con éxito.',
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
