import { Controller, Post, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      const userId = req.user.userId;
      console.log('Creating PaymentIntent for user:', userId);
      const paymentIntent = await this.stripeService.createPaymentIntent(userId);
      console.log('PaymentIntent created:', paymentIntent.id);
      return {
        success: true,
        data: {
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        },
      };
    } catch (error) {
      console.error('Stripe error:', error.message);
      throw new HttpException(
        { success: false, message: 'Erreur Stripe: ' + error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le statut d’abonnement' })
  async getSubscriptionStatus(@Req() req) {
    try {
      const user = await this.usersService.findOne(req.user.userId);
      return {
        success: true,
        data: { subscription_status: user.subscription_status },
      };
    } catch (error) {
      console.error('Error fetching subscription status:', error.message);
      throw new HttpException(
        { success: false, message: 'Utilisateur non trouvé' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}