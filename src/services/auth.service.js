const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const { users } = require('../config/dataStore');
const User = require('../models/User');

class AuthService {
  /**
   * Genera token JWT con los datos esenciales del usuario
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      documentNumber: user.documentNumber,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Login directo de demostración para desarrollo y pruebas de roles
   */
  static async login({ email, role }) {
    let user = users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

    if (!user) {
      // Si se pasa un nuevo email, se crea con el rol seleccionado o por defecto INSTRUCTOR
      user = new User({
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: role && User.isValidRole(role) ? role : User.ROLES.INSTRUCTOR,
      });
      users.push(user);
    } else if (role && User.isValidRole(role)) {
      user.role = role;
    }

    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  /**
   * HU-01: Flujo de Autenticación con Google OAuth (Gmail Institucional)
   */
  static async googleAuth({ googleToken, email, name, avatar }) {
    if (!email) {
      throw new Error('El correo electrónico es requerido para autenticar con Google');
    }

    // Validación de dominio institucional SENA
    const esInstitucional = email.endsWith('@misena.edu.co') || 
                            email.endsWith('@sena.edu.co') || 
                            email.endsWith('@seguridadsena.gov.co');

    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Determinación de rol automático según dominio o defecto
      let defaultRole = User.ROLES.INSTRUCTOR;
      if (email.includes('admin')) {
        defaultRole = User.ROLES.ADMIN;
      } else if (email.includes('guarda') || email.includes('seguridad')) {
        defaultRole = User.ROLES.GUARDA;
      }

      user = new User({
        name: name || email.split('@')[0],
        email,
        role: defaultRole,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      });

      users.push(user);
    }

    const token = this.generateToken(user);

    return {
      user,
      token,
      esInstitucional,
    };
  }

  /**
   * Lista todos los usuarios registrados (Rol ADMIN)
   */
  static async listUsers() {
    return users;
  }

  /**
   * Obtiene el perfil de un usuario por su ID
   */
  static async getUserById(id) {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }
}

module.exports = AuthService;
