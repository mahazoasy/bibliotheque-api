import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const Stripe = require('stripe');

@Injectable()
export class StripeService {
  private stripe: any;

  constructor(private config: ConfigService) {
    const secretKey = this.config.getOrThrow<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      timeout: 120000,      // 120 secondes (2 minutes)
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntent(userId: string, amount = 500, currency = 'eur'): Promise<any> {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { user_id: userId, plan: 'premium' },
      });
    } catch (error) {
      console.error('Stripe createPaymentIntent error:', error);
      throw new InternalServerErrorException('Erreur lors de la création du PaymentIntent');
    }
  }

  constructWebhookEvent(payload: Buffer, signature: string, webhookSecret: string): any {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      throw new InternalServerErrorException('Signature webhook invalide');
    }
  }
}