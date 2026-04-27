import { Controller, Post, Headers, RawBody, HttpCode, HttpStatus } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private stripeService: StripeService,
    private config: ConfigService,
    private usersService: UsersService,
  ) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() rawBody: Buffer,
  ) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    if (!signature) {
      return { success: false, message: 'Signature manquante' };
    }
    try {
      const event = this.stripeService.constructWebhookEvent(rawBody, signature, webhookSecret);
      if (event.type === 'payment_intent.succeeded') {
        const metadata = event.data.object.metadata;
        const userId = metadata.user_id;
        if (userId) {
          await this.usersService.updateSubscriptionStatus(userId, 'premium');
        }
      }
      return { received: true };
    } catch (err) {
      return { success: false, message: 'Signature invalide' };
    }
  }
}