export type UserRole = 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';

export class User {
  public id: string;
  public name: string;
  public email: string;
  public role: UserRole;
  public documentNumber: string;
  public phone: string;
  public avatar: string;
  public createdAt: string;

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    role?: UserRole;
    documentNumber?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
  }) {
    this.id = data.id || `usr-${Date.now()}`;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || 'INSTRUCTOR';
    this.documentNumber = data.documentNumber || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'user')}`;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  public static ROLES = {
    ADMIN: 'ADMIN' as UserRole,
    GUARDA: 'GUARDA' as UserRole,
    INSTRUCTOR: 'INSTRUCTOR' as UserRole,
  };

  public static isValidRole(role: string): boolean {
    return Object.values(User.ROLES).includes(role as UserRole);
  }
}

export default User;
