import { loans, rooms } from '../config/dataStore';
import Loan from '../models/Loan';

export class DashboardService {
  public static async getMetrics() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const loansToday = loans.filter((l) => {
      const loanDate = new Date(l.fechaHoraRecibido).getTime();
      return loanDate >= todayStart;
    });

    const pendientes = loans.filter((l) => l.estado === Loan.ESTADOS.PENDIENTE_APROBACION).length;
    const aprobados = loans.filter((l) => l.estado === Loan.ESTADOS.APROBADO_Y_FIRMADO).length;
    const rechazados = loans.filter((l) => l.estado === Loan.ESTADOS.RECHAZADO).length;

    const totalPcsEnUso = loansToday.reduce((acc, curr) => acc + (Number(curr.numeroPC) || 0), 0);
    const totalAulas = rooms.length;
    const aulasActivasHoy = new Set(loansToday.map((l) => l.aula)).size;
    const porcentajeOcupacion = totalAulas > 0 ? Math.round((aulasActivasHoy / totalAulas) * 100) : 0;

    return {
      kpis: {
        totalSalasPrestadasHoy: loansToday.length,
        pendientesPorVerificar: pendientes,
        aprobadosYFirmados: aprobados,
        rechazadosConNovedades: rechazados,
        totalHistoricoPrestamos: loans.length,
        porcentajeOcupacionAulas: `${porcentajeOcupacion}%`,
      },
      inventarioFisicoEnUsoHoy: {
        pcs: totalPcsEnUso,
      },
      aulasDisponibles: rooms,
      timestamp: new Date().toISOString(),
    };
  }
}

export default DashboardService;
