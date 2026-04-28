import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [StripeModule, UsersModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}