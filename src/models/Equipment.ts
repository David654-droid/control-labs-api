export type EquipmentType = 'PC' | 'MONITOR' | 'TECLADO' | 'MOUSE' | 'TV' | 'PORTATIL' | 'OTRO';
export type TechnicalStatus = 'OPERATIVO' | 'EN_MANTENIMIENTO' | 'DE_BAJA';

export class Equipment {
  public id: string;
  public serial: string;
  public type: EquipmentType;
  public brand: string;
  public model: string;
  public roomId: string;
  public technicalStatus: TechnicalStatus;
  public location: string;
  public createdAt: string;
  public updatedAt?: string;

  constructor(data: {
    id?: string;
    serial: string;
    type?: EquipmentType;
    brand: string;
    model?: string;
    roomId: string;
    technicalStatus?: TechnicalStatus;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = data.id || `EQ-${Date.now().toString().slice(-4)}`;
    this.serial = data.serial;
    this.type = data.type || 'PC';
    this.brand = data.brand;
    this.model = data.model || 'Estándar SENA';
    this.roomId = data.roomId;
    this.technicalStatus = data.technicalStatus || 'OPERATIVO';
    this.location = data.location || 'Laboratorio vinculado';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt;
  }
}

export default Equipment;
