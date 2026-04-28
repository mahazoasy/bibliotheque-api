import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StripeService } from '../stripe/stripe.service';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private stripeService: StripeService,
    private usersService: UsersService,
  ) {}

  @Post('payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un PaymentIntent Stripe' })
  async createPaymentIntent(@Req() req) {
    const userId = req.user.userId;
    const paymentIntent = await this.stripeService.createPaymentIntent(userId);
    return {
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
      },
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le statut d’abonnement' })
  async getSubscriptionStatus(@Req() req) {
    const user = await this.usersService.findOne(req.user.userId);
    return {
      success: true,
      data: { subscription_status: user.subscription_status },
    };
  }
}