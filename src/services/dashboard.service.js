const { loans, rooms } = require('../config/dataStore');
const Loan = require('../models/Loan');

class DashboardService {
  /**
   * HU-04: Métricas del Dashboard en Tiempo Real (KPIs)
   */
  static async getMetrics() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Filtros de hoy
    const loansToday = loans.filter((l) => {
      const loanDate = new Date(l.fechaHoraRecibido).getTime();
      return loanDate >= todayStart;
    });

    // Conteos por estado
    const pendientes = loans.filter((l) => l.estado === Loan.ESTADOS.PENDIENTE_APROBACION).length;
    const aprobados = loans.filter((l) => l.estado === Loan.ESTADOS.APROBADO_Y_FIRMADO).length;
    const rechazados = loans.filter((l) => l.estado === Loan.ESTADOS.RECHAZADO).length;

    // Equipos físicos en préstamo activo hoy
    const totalPcsEnUso = loansToday.reduce((acc, curr) => acc + (Number(curr.numeroPC) || 0), 0);
    const totalMousesEnUso = loansToday.reduce((acc, curr) => acc + (Number(curr.mouse) || 0), 0);
    const totalTecladosEnUso = loansToday.reduce((acc, curr) => acc + (Number(curr.teclados) || 0), 0);

    // Conteo por aula
    const distributionByRoom = {};
    loans.forEach((l) => {
      distributionByRoom[l.aula] = (distributionByRoom[l.aula] || 0) + 1;
    });

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
        aulasActivasHoy,
        totalAulasRegistradas: totalAulas,
      },
      inventarioFisicoEnUsoHoy: {
        pcs: totalPcsEnUso,
        mouses: totalMousesEnUso,
        teclados: totalTecladosEnUso,
      },
      distribucionPorAula: distributionByRoom,
      aulasDisponibles: rooms,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = DashboardService;
