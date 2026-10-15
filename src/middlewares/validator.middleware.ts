import { Request, Response, NextFunction } from 'express';

export const validateLoanCreation = (req: Request, res: Response, next: NextFunction) => {
  const { aula, numeroPC, mouse, teclados, instructorRecibe, nombreGuardaEntrega } = req.body;
  const errors: string[] = [];

  if (!aula) errors.push("El campo 'aula' es obligatorio.");
  if (numeroPC === undefined) errors.push("El campo 'numeroPC' es obligatorio.");
  if (mouse === undefined) errors.push("El campo 'mouse' es obligatorio.");
  if (teclados === undefined) errors.push("El campo 'teclados' es obligatorio.");
  if (!instructorRecibe) errors.push("El campo 'instructorRecibe' es obligatorio.");
  if (!nombreGuardaEntrega) errors.push("El campo 'nombreGuardaEntrega' es obligatorio.");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios del formato físico SENA.',
      errors,
    });
  }

  next();
};
