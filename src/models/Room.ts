export type RoomStatus = 'OPERATIVO' | 'MANTENIMIENTO' | 'INACTIVO';

export class Room {
  public id: string;
  public name: string;
  public capacity: number;
  public location: string;
  public availablePCs?: number;
  public status: RoomStatus;
  public createdAt: string;
  public updatedAt?: string;

  constructor(data: {
    id?: string;
    name: string;
    capacity: number | string;
    location: string;
    availablePCs?: number | string;
    status?: RoomStatus;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = data.id || `SALA-${Date.now().toString().slice(-4)}`;
    this.name = data.name;
    this.capacity = Number(data.capacity);
    this.location = data.location;
    this.availablePCs = data.availablePCs !== undefined ? Number(data.availablePCs) : Number(data.capacity);
    this.status = data.status || 'OPERATIVO';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt;
  }
}

export default Room;
