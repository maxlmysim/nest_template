import { Provider } from '@nestjs/common';
import { STRIPE_CLIENT, STRIPE_CONFIG } from './stripe.tokens';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeConfig } from './stripe.types';
import { StripePaymentProvider } from './stripe-payment.provider';

export const stripeProviders: Provider[] = [
  {
    provide: STRIPE_CONFIG,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): StripeConfig => ({
      secretKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      webhookSecret: configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    }),
  },
  {
    provide: STRIPE_CLIENT,
    inject: [STRIPE_CONFIG],
    useFactory: (config: StripeConfig): Stripe.Stripe => {
      return new Stripe(config.secretKey);
    },
  },
  StripePaymentProvider,
];
