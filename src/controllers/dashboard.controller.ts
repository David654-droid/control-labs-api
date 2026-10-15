import { Request, Response, NextFunction } from 'express';
import DashboardService from '../services/dashboard.service';

export class DashboardController {
  /**
   * HU-04: Dashboard de métricas y KPIs en tiempo real
   * GET /api/v1/dashboard/metrics
   */
  public static async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
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

export default DashboardController;
