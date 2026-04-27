import { Controller, Post, Get, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Crée un PaymentIntent Stripe pour un abonnement premium' })
  @ApiResponse({ status: 200, description: 'PaymentIntent créé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async createPaymentIntent(@Req() req) {
    // Récupère l'ID utilisateur depuis le JWT
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
  @ApiOperation({ summary: 'Récupère le statut d\'abonnement de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Statut récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getSubscriptionStatus(@Req() req) {
    const user = await this.usersService.findOne(req.user.userId);
    return {
      success: true,
      data: { subscription_status: user.subscription_status },
    };
  }
}