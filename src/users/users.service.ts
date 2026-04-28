import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException("Nom d'utilisateur non trouvé");
    return user;
  }

  async create(createUserDto: { username: string; password: string; name: string; subscription_status?: string }): Promise<User> {
    const existing = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (existing) {
      throw new ConflictException('Ce nom d’utilisateur existe déjà');
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { subscription_status: status },
      { returnDocument: 'after' },
    ).exec();
    if (!updated) throw new NotFoundException('Utilisateur non trouvé');
    return updated;
  }
}