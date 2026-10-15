export type UserRole = 'estudiante' | 'docente' | 'administrador' | 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';
export type AccountStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export class User {
  public id: string;
  public name: string;
  public email: string;
  public role: UserRole;
  public status: AccountStatus;
  public password?: string;
  public documentNumber: string;
  public phone: string;
  public avatar: string;
  public createdAt: string;
  public updatedAt?: string;

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    role?: UserRole;
    status?: AccountStatus;
    password?: string;
    documentNumber?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.id = data.id || `usr-${Date.now()}`;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || 'estudiante';
    this.status = data.status || 'ACTIVO';
    this.password = data.password || 'sena1234';
    this.documentNumber = data.documentNumber || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'user')}`;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt;
  }

  public static isValidRole(role: string): boolean {
    const roles: string[] = ['estudiante', 'docente', 'administrador', 'ADMIN', 'GUARDA', 'INSTRUCTOR'];
    return roles.includes(role);
  }
}

export default User;
