/**
 * Modelo de Préstamo de Sala (Loan) - Formato Oficial Físico del SENA
 * Campos obligatorios del formato:
 * 1. aula
 * 2. numeroPC
 * 3. mouse
 * 4. teclados
 * 5. cargador
 * 6. fechaHoraRecibido
 * 7. numeroTVs
 * 8. controlTV
 * 9. instructorRecibe
 * 10. telefono
 * 11. nombreGuardaEntrega
 */

class Loan {
  static ESTADOS = {
    PENDIENTE_APROBACION: 'PENDIENTE_APROBACION',
    APROBADO_Y_FIRMADO: 'APROBADO_Y_FIRMADO',
    RECHAZADO: 'RECHAZADO',
  };

  constructor({
    id,
    aula,
    numeroPC,
    mouse,
    teclados,
    cargador,
    fechaHoraRecibido,
    numeroTVs,
    controlTV,
    instructorRecibe,
    telefono,
    nombreGuardaEntrega,
    estado = Loan.ESTADOS.PENDIENTE_APROBACION,
    observaciones = '',
    fechaAceptacion = null,
    creadoPor = null,
    createdAt = new Date().toISOString()
  }) {
    this.id = id || `loan-${Date.now()}`;
    this.aula = aula;
    this.numeroPC = Number(numeroPC);
    this.mouse = Number(mouse);
    this.teclados = Number(teclados);
    this.cargador = Number(cargador);
    this.fechaHoraRecibido = fechaHoraRecibido || new Date().toISOString();
    this.numeroTVs = Number(numeroTVs);
    this.controlTV = Boolean(controlTV);
    this.instructorRecibe = instructorRecibe;
    this.telefono = telefono;
    this.nombreGuardaEntrega = nombreGuardaEntrega;
    this.estado = estado;
    this.observaciones = observaciones;
    this.fechaAceptacion = fechaAceptacion;
    this.creadoPor = creadoPor;
    this.createdAt = createdAt;
  }
}

module.exports = Loan;
