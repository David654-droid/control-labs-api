const { loans, rooms } = require('../config/dataStore');
const Loan = require('../models/Loan');

class LoanService {
  /**
   * HU-02: Registro de Préstamo de Sala (Rol Guarda)
   * Diligencia los 11 campos oficiales del formato SENA
   */
  static async createLoan(loanData, currentUser) {
    const newLoan = new Loan({
      aula: loanData.aula,
      numeroPC: loanData.numeroPC,
      mouse: loanData.mouse,
      teclados: loanData.teclados,
      cargador: loanData.cargador,
      fechaHoraRecibido: loanData.fechaHoraRecibido || new Date().toISOString(),
      numeroTVs: loanData.numeroTVs,
      controlTV: loanData.controlTV,
      instructorRecibe: loanData.instructorRecibe,
      telefono: loanData.telefono,
      nombreGuardaEntrega: loanData.nombreGuardaEntrega || currentUser.name,
      estado: Loan.ESTADOS.PENDIENTE_APROBACION,
      observaciones: loanData.observaciones || 'Registro inicial por personal de seguridad SENA.',
      creadoPor: currentUser.email,
    });

    loans.unshift(newLoan);
    return newLoan;
  }

  /**
   * HU-03: Aceptación de Inventario (Rol Instructor)
   * Confirma la entrega a entera satisfacción
   */
  static async acceptLoan(loanId, { observaciones, firmaDigital }, currentInstructor) {
    const loan = loans.find((l) => l.id === loanId);

    if (!loan) {
      const error = new Error(`No se encontró el préstamo con ID: ${loanId}`);
      error.statusCode = 404;
      throw error;
    }

    if (loan.estado === Loan.ESTADOS.APROBADO_Y_FIRMADO) {
      const error = new Error('Este inventario ya ha sido previamente aceptado y firmado.');
      error.statusCode = 400;
      throw error;
    }

    loan.estado = Loan.ESTADOS.APROBADO_Y_FIRMADO;
    loan.fechaAceptacion = new Date().toISOString();
    loan.instructorFirmante = currentInstructor.name || currentInstructor.email;
    loan.firmaDigital = firmaDigital || `SIGNED_BY_${currentInstructor.email}_AT_${new Date().toISOString()}`;
    
    if (observaciones) {
      loan.observaciones = `${loan.observaciones ? loan.observaciones + ' | ' : ''}Observación Instructor: ${observaciones}`;
    }

    return loan;
  }

  /**
   * Rechazar préstamo con novedades físicas
   */
  static async rejectLoan(loanId, { motivo }, currentInstructor) {
    const loan = loans.find((l) => l.id === loanId);

    if (!loan) {
      const error = new Error(`No se encontró el préstamo con ID: ${loanId}`);
      error.statusCode = 404;
      throw error;
    }

    loan.estado = Loan.ESTADOS.RECHAZADO;
    loan.fechaRechazo = new Date().toISOString();
    loan.motivoRechazo = motivo || 'Novedades reportadas en inventario físico.';
    loan.rechazadoPor = currentInstructor.name || currentInstructor.email;

    return loan;
  }

  /**
   * HU-04: Consulta de Historial con Filtros Avanzados (Salón, Rango de Fechas, Estado)
   */
  static async getHistory({ room, startDate, endDate, status, limit = 50, page = 1 }) {
    let results = [...loans];

    // Filtro por aula / salón (ej: "301" o "Sala 301 TI")
    if (room && room.trim() !== '') {
      const query = room.toLowerCase().trim();
      results = results.filter((item) => item.aula.toLowerCase().includes(query));
    }

    // Filtro por rango de fechas (startDate a endDate)
    if (startDate) {
      const start = new Date(startDate).getTime();
      if (!isNaN(start)) {
        results = results.filter((item) => new Date(item.fechaHoraRecibido).getTime() >= start);
      }
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      if (!isNaN(end)) {
        // Fin del día si es fecha simple
        const endOfDay = end + 86400000 - 1;
        results = results.filter((item) => new Date(item.fechaHoraRecibido).getTime() <= endOfDay);
      }
    }

    // Filtro por estado
    if (status && status.trim() !== '') {
      results = results.filter((item) => item.estado.toUpperCase() === status.toUpperCase().trim());
    }

    // Paginación simple
    const parsedLimit = Math.max(1, parseInt(limit));
    const parsedPage = Math.max(1, parseInt(page));
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginated = results.slice(startIndex, startIndex + parsedLimit);

    return {
      total: results.length,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(results.length / parsedLimit) || 1,
      data: paginated,
    };
  }

  /**
   * Obtener detalle de préstamo por ID
   */
  static async getById(loanId) {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      const error = new Error(`Préstamo con ID ${loanId} no encontrado.`);
      error.statusCode = 404;
      throw error;
    }
    return loan;
  }

  /**
   * Listar aulas disponibles
   */
  static async getAvailableRooms() {
    return rooms;
  }
}

module.exports = LoanService;
