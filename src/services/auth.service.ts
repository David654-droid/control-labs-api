import jwt from 'jsonwebtoken';
import config from '../config/env.config';
import { users, UserData } from '../config/dataStore';
import User, { UserRole } from '../models/User';

export class AuthService {
  public static generateToken(user: UserData): string {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      documentNumber: user.documentNumber,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  public static async login({ email, role }: { email: string; role?: UserRole }) {
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = new User({
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: role && User.isValidRole(role) ? role : 'INSTRUCTOR',
      });
      users.push(user);
    } else if (role && User.isValidRole(role)) {
      user.role = role;
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  public static async listUsers(): Promise<UserData[]> {
    return users;
  }
}

export default AuthService;
