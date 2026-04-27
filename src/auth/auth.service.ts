import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(username: string, password: string) {
    // Recherche ou création d'un utilisateur par défaut
    let user = await this.userModel.findOne({ username: 'admin' });
    if (!user) {
      user = new this.userModel({
        username: 'admin',
        password: 'password123',
        name: 'Admin',
        subscription_status: 'free',
      });
      await user.save();
    }

    if (username !== 'admin' || password !== 'password123') {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { sub: user._id, username: user.username };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    
    return { token, user };
  }
}