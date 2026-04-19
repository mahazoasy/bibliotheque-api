import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Pour simplifier, on utilise un utilisateur fictif (pas de table User dans le sujet)
const FAKE_USER = {
  username: 'admin',
  password: 'password123', // en vrai il faudrait hasher
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async login(username: string, password: string) {
    if (username !== FAKE_USER.username || password !== FAKE_USER.password) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const payload = { username, sub: 1 };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    return { token, user: { id: 1, username } };
  }
}