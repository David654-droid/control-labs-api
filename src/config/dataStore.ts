export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';
  documentNumber?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  availablePCs: number;
  location: string;
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
    role: 'ADMIN',
    documentNumber: '1098765432',
    phone: '3001234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-guarda-1',
    name: 'Carlos Mendoza',
    email: 'carlos.guarda@seguridadsena.gov.co',
    role: 'GUARDA',
    documentNumber: '1012345678',
    phone: '3109876543',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guarda',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-instructor-1',
    name: 'Ing. Sandra Patricia Gómez',
    email: 'sgomez@misena.edu.co',
    role: 'INSTRUCTOR',
    documentNumber: '1023456789',
    phone: '3205557890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
    createdAt: new Date().toISOString()
  }
];

export const rooms: RoomData[] = [
  { id: 'SALA-301', name: 'Sala 301 TI', capacity: 30, availablePCs: 30, location: 'Bloque B - Piso 3' },
  { id: 'SALA-302', name: 'Sala 302 TI', capacity: 32, availablePCs: 32, location: 'Bloque B - Piso 3' },
  { id: 'SALA-401', name: 'Sala 401 Multimedia', capacity: 25, availablePCs: 25, location: 'Bloque B - Piso 4' },
  { id: 'SALA-402', name: 'Sala 402 Redes', capacity: 28, availablePCs: 28, location: 'Bloque B - Piso 4' }
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
