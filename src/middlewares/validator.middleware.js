/**
 * Middleware para validar los 11 campos obligatorios del formato físico SENA
 */

const validateLoanCreation = (req, res, next) => {
  const {
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
  } = req.body;

  const errors = [];

  if (!aula || typeof aula !== 'string' || aula.trim() === '') {
    errors.push("El campo 'aula' es obligatorio (ej: 'Sala 302 TI').");
  }

  if (numeroPC === undefined || numeroPC === null || isNaN(numeroPC) || Number(numeroPC) < 0) {
    errors.push("El campo 'numeroPC' es obligatorio y debe ser un número entero mayor o igual a 0.");
  }

  if (mouse === undefined || mouse === null || isNaN(mouse) || Number(mouse) < 0) {
    errors.push("El campo 'mouse' es obligatorio y debe ser un número entero mayor o igual a 0.");
  }

  if (teclados === undefined || teclados === null || isNaN(teclados) || Number(teclados) < 0) {
    errors.push("El campo 'teclados' es obligatorio y debe ser un número entero mayor o igual a 0.");
  }

  if (cargador === undefined || cargador === null || isNaN(cargador) || Number(cargador) < 0) {
    errors.push("El campo 'cargador' es obligatorio y debe ser un número entero mayor o igual a 0.");
  }

  if (numeroTVs === undefined || numeroTVs === null || isNaN(numeroTVs) || Number(numeroTVs) < 0) {
    errors.push("El campo 'numeroTVs' es obligatorio y debe ser un número mayor o igual a 0.");
  }

  if (controlTV === undefined || controlTV === null) {
    errors.push("El campo 'controlTV' es obligatorio (booleano true/false o cantidad).");
  }

  if (!instructorRecibe || typeof instructorRecibe !== 'string' || instructorRecibe.trim() === '') {
    errors.push("El campo 'instructorRecibe' es obligatorio (correo o nombre del instructor responsable).");
  }

  if (!telefono || typeof telefono !== 'string' || telefono.trim() === '') {
    errors.push("El campo 'telefono' es obligatorio para comunicación de novedades.");
  }

  if (!nombreGuardaEntrega || typeof nombreGuardaEntrega !== 'string' || nombreGuardaEntrega.trim() === '') {
    errors.push("El campo 'nombreGuardaEntrega' es obligatorio (identificación del funcionario de seguridad).");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios del formato físico SENA o tienen formato inválido.',
      errors,
    });
  }

  next();
};

module.exports = {
  validateLoanCreation,
};
