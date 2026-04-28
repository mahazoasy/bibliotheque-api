import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [StripeModule, UsersModule],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}