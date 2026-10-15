export type LoanEstado = 'PENDIENTE_APROBACION' | 'APROBADO_Y_FIRMADO' | 'RECHAZADO';

export class Loan {
  public static ESTADOS = {
    PENDIENTE_APROBACION: 'PENDIENTE_APROBACION' as LoanEstado,
    APROBADO_Y_FIRMADO: 'APROBADO_Y_FIRMADO' as LoanEstado,
    RECHAZADO: 'RECHAZADO' as LoanEstado,
  };

  public id: string;
  public aula: string;
  public numeroPC: number;
  public mouse: number;
  public teclados: number;
  public cargador: number;
  public fechaHoraRecibido: string;
  public numeroTVs: number;
  public controlTV: boolean;
  public instructorRecibe: string;
  public telefono: string;
  public nombreGuardaEntrega: string;
  public estado: LoanEstado;
  public observaciones?: string;
  public fechaAceptacion?: string | null;
  public firmaDigital?: string | null;
  public creadoPor?: string | null;
  public createdAt: string;

  constructor(data: {
    id?: string;
    aula: string;
    numeroPC: number | string;
    mouse: number | string;
    teclados: number | string;
    cargador: number | string;
    fechaHoraRecibido?: string;
    numeroTVs: number | string;
    controlTV: boolean | string;
    instructorRecibe: string;
    telefono: string;
    nombreGuardaEntrega: string;
    estado?: LoanEstado;
    observaciones?: string;
    fechaAceptacion?: string | null;
    firmaDigital?: string | null;
    creadoPor?: string | null;
    createdAt?: string;
  }) {
    this.id = data.id || `loan-${Date.now()}`;
    this.aula = data.aula;
    this.numeroPC = Number(data.numeroPC);
    this.mouse = Number(data.mouse);
    this.teclados = Number(data.teclados);
    this.cargador = Number(data.cargador);
    this.fechaHoraRecibido = data.fechaHoraRecibido || new Date().toISOString();
    this.numeroTVs = Number(data.numeroTVs);
    this.controlTV = Boolean(data.controlTV);
    this.instructorRecibe = data.instructorRecibe;
    this.telefono = data.telefono;
    this.nombreGuardaEntrega = data.nombreGuardaEntrega;
    this.estado = data.estado || Loan.ESTADOS.PENDIENTE_APROBACION;
    this.observaciones = data.observaciones || '';
    this.fechaAceptacion = data.fechaAceptacion || null;
    this.firmaDigital = data.firmaDigital || null;
    this.creadoPor = data.creadoPor || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

export default Loan;
