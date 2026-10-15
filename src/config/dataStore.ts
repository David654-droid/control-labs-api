export type UserProfileRole = 'estudiante' | 'docente' | 'administrador' | 'INSTRUCTOR' | 'GUARDA' | 'ADMIN';
export type AccountStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserProfileRole;
  status: AccountStatus;
  password?: string;
  documentNumber?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export type RoomOperationalStatus = 'OPERATIVO' | 'MANTENIMIENTO' | 'INACTIVO';

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  location: string;
  availablePCs?: number;
  status: RoomOperationalStatus;
  createdAt: string;
  updatedAt?: string;
}

export type TechnicalStatus = 'OPERATIVO' | 'EN_MANTENIMIENTO' | 'DE_BAJA';

export interface EquipmentData {
  id: string;
  serial: string;
  type: 'PC' | 'MONITOR' | 'TECLADO' | 'MOUSE' | 'TV' | 'PORTATIL' | 'OTRO';
  brand: string;
  model: string;
  roomId: string; // Vinculación a un ambiente / laboratorio
  technicalStatus: TechnicalStatus;
  location: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoanData {
  id: string;
  aula: string;
  numeroPC: number;
  mouse: number;
  teclados: number;
  cargador: number;
  fechaHoraRecibido: string;
  numeroTVs: number;
  controlTV: boolean;
  instructorRecibe: string;
  telefono: string;
  nombreGuardaEntrega: string;
  estado: 'PENDIENTE_APROBACION' | 'APROBADO_Y_FIRMADO' | 'RECHAZADO';
  observaciones?: string;
  fechaAceptacion?: string | null;
  firmaDigital?: string | null;
  creadoPor?: string | null;
  createdAt?: string;
}

export const users: UserData[] = [
  {
    id: 'usr-admin-1',
    name: 'Coordinador ADSO SENA',
    email: 'admin.adso@misena.edu.co',
    role: 'administrador',
    status: 'ACTIVO',
    documentNumber: '1098765432',
    phone: '3001234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-docente-1',
    name: 'Ing. Sandra Patricia Gómez',
    email: 'sgomez@misena.edu.co',
    role: 'docente',
    status: 'ACTIVO',
    documentNumber: '1023456789',
    phone: '3205557890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-estudiante-1',
    name: 'David Zapata',
    email: 'david.zapata@misena.edu.co',
    role: 'estudiante',
    status: 'ACTIVO',
    documentNumber: '1034567890',
    phone: '3157778899',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    createdAt: new Date().toISOString()
  }
];

export const rooms: RoomData[] = [
  {
    id: 'SALA-301',
    name: 'Sala 301 TI',
    capacity: 30,
    location: 'Bloque B - Piso 3',
    availablePCs: 30,
    status: 'OPERATIVO',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SALA-302',
    name: 'Sala 302 TI',
    capacity: 32,
    location: 'Bloque B - Piso 3',
    availablePCs: 32,
    status: 'OPERATIVO',
    createdAt: new Date().toISOString()
  },
  {
    id: 'LAB-REDES',
    name: 'Laboratorio de Redes y Telecomunicaciones',
    capacity: 25,
    location: 'Bloque C - Piso 1',
    availablePCs: 25,
    status: 'OPERATIVO',
    createdAt: new Date().toISOString()
  }
];

export const equipments: EquipmentData[] = [
  {
    id: 'EQ-PC-001',
    serial: 'SN-SENA-99401',
    type: 'PC',
    brand: 'Lenovo',
    model: 'ThinkCentre M720',
    roomId: 'SALA-301',
    technicalStatus: 'OPERATIVO',
    location: 'Estación 01 - Fila A',
    createdAt: new Date().toISOString()
  },
  {
    id: 'EQ-PC-002',
    serial: 'SN-SENA-99402',
    type: 'PC',
    brand: 'Lenovo',
    model: 'ThinkCentre M720',
    roomId: 'SALA-302',
    technicalStatus: 'OPERATIVO',
    location: 'Estación 05 - Fila B',
    createdAt: new Date().toISOString()
  },
  {
    id: 'EQ-SW-001',
    serial: 'SN-CISCO-88210',
    type: 'OTRO',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    roomId: 'LAB-REDES',
    technicalStatus: 'EN_MANTENIMIENTO',
    location: 'Rack Principal - Bahía 4',
    createdAt: new Date().toISOString()
  }
];

export const loans: LoanData[] = [
  {
    id: 'loan-001',
    aula: 'Sala 301 TI',
    numeroPC: 30,
    mouse: 30,
    teclados: 30,
    cargador: 30,
    fechaHoraRecibido: new Date(Date.now() - 3600000 * 5).toISOString(),
    numeroTVs: 1,
    controlTV: true,
    instructorRecibe: 'sgomez@misena.edu.co',
    telefono: '3205557890',
    nombreGuardaEntrega: 'Carlos Mendoza',
    estado: 'APROBADO_Y_FIRMADO',
    observaciones: 'Todo en perfecto estado. Entrega a satisfacción.',
    fechaAceptacion: new Date(Date.now() - 3600000 * 4).toISOString(),
    creadoPor: 'carlos.guarda@seguridadsena.gov.co',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];
