/**
 * Modelo de Usuario para ControlLabs
 * Roles soportados: ADMIN, GUARDA, INSTRUCTOR
 */

class User {
  constructor({ id, name, email, role, documentNumber, phone, avatar, createdAt }) {
    this.id = id || `usr-${Date.now()}`;
    this.name = name;
    this.email = email;
    this.role = role || 'INSTRUCTOR';
    this.documentNumber = documentNumber || '';
    this.phone = phone || '';
    this.avatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static ROLES = {
    ADMIN: 'ADMIN',
    GUARDA: 'GUARDA',
    INSTRUCTOR: 'INSTRUCTOR',
  };

  static isValidRole(role) {
    return Object.values(User.ROLES).includes(role);
  }
}

module.exports = User;
