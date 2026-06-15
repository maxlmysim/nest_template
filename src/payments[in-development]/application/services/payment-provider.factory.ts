import { Injectable } from '@nestjs/common';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { StripePaymentProvider } from '../../infrastructure/providers/stripe/stripe-payment.provider';
import { PaymentProviderPort } from '../../domain/ports/payment-provider/payment-provider.port';

@Injectable()
export class PaymentProviderFactory {
  constructor(private readonly stripeProvider: StripePaymentProvider) {}

  get(provider: PaymentProvider): PaymentProviderPort {
    switch (provider) {
      case PaymentProvider.STRIPE: {
        return this.stripeProvider;
      }

      default: {
        this.assertNever(provider);
      }
    }
  }

  private assertNever(provider: string): never {
    throw new Error(`Unsupported payment provider ${provider}`);
  }
}
