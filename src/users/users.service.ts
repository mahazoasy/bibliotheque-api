import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { subscription_status: status },
      { returnDocument: 'after' },
    ).exec();
  }
}