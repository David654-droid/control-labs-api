import { loans, rooms, LoanData } from '../config/dataStore';
import Loan from '../models/Loan';

export class LoanService {
  /**
   * HU-02: Registro de Préstamo de Sala (Rol Guarda)
   */
  public static async createLoan(loanData: any, currentUser: { email: string; name?: string }): Promise<LoanData> {
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
      nombreGuardaEntrega: loanData.nombreGuardaEntrega || currentUser.name || 'Guarda de Turno',
      estado: Loan.ESTADOS.PENDIENTE_APROBACION,
      observaciones: loanData.observaciones || 'Registro de inventario físico SENA.',
      creadoPor: currentUser.email,
    });

    loans.unshift(newLoan);
    return newLoan;
  }

  /**
   * HU-03: Aceptación de Inventario (Rol Instructor)
   */
  public static async acceptLoan(
    loanId: string,
    { observaciones, firmaDigital }: { observaciones?: string; firmaDigital?: string },
    currentInstructor: { email: string; name?: string }
  ): Promise<LoanData> {
    const loan = loans.find((l) => l.id === loanId);

    if (!loan) {
      const error: any = new Error(`No se encontró el préstamo con ID: ${loanId}`);
      error.statusCode = 404;
      throw error;
    }

    if (loan.estado === Loan.ESTADOS.APROBADO_Y_FIRMADO) {
      const error: any = new Error('Este inventario ya ha sido previamente aceptado y firmado.');
      error.statusCode = 400;
      throw error;
    }

    loan.estado = Loan.ESTADOS.APROBADO_Y_FIRMADO;
    loan.fechaAceptacion = new Date().toISOString();
    loan.firmaDigital = firmaDigital || `SIGNED_BY_${currentInstructor.email}_AT_${new Date().toISOString()}`;

    if (observaciones) {
      loan.observaciones = `${loan.observaciones ? loan.observaciones + ' | ' : ''}Observación Instructor: ${observaciones}`;
    }

    return loan;
  }

  /**
   * HU-04: Consulta de Historial con Filtros Avanzados
   */
  public static async getHistory({
    room,
    startDate,
    endDate,
    status,
    limit = 50,
    page = 1,
  }: {
    room?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number | string;
    page?: number | string;
  }) {
    let results = [...loans];

    if (room && room.trim() !== '') {
      const query = room.toLowerCase().trim();
      results = results.filter((item) => item.aula.toLowerCase().includes(query));
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      if (!isNaN(start)) {
        results = results.filter((item) => new Date(item.fechaHoraRecibido).getTime() >= start);
      }
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      if (!isNaN(end)) {
        const endOfDay = end + 86400000 - 1;
        results = results.filter((item) => new Date(item.fechaHoraRecibido).getTime() <= endOfDay);
      }
    }

    if (status && status.trim() !== '') {
      results = results.filter((item) => item.estado.toUpperCase() === status.toUpperCase().trim());
    }

    const parsedLimit = Math.max(1, Number(limit) || 50);
    const parsedPage = Math.max(1, Number(page) || 1);
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

  public static async getById(loanId: string): Promise<LoanData> {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      const error: any = new Error(`Préstamo con ID ${loanId} no encontrado.`);
      error.statusCode = 404;
      throw error;
    }
    return loan;
  }

  public static async getAvailableRooms() {
    return rooms;
  }
}

export default LoanService;
