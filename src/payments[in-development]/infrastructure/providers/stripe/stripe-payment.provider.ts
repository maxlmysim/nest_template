import { PaymentProviderPort } from '../../../domain/ports/payment-provider/payment-provider.port';
import {
  CreateCheckoutInput,
  CreateCheckoutResult,
  VerifiedWebhookResult,
  VerifyWebhookInput,
} from '../../../domain/ports/payment-provider/payment-provider.types';
import Stripe from 'stripe';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT, STRIPE_CONFIG } from './stripe.tokens';
import type { StripeConfig } from './stripe.types';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

@Injectable()
export class StripePaymentProvider implements PaymentProviderPort {
  constructor(
    @Inject(STRIPE_CONFIG) private readonly config: StripeConfig,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe.Stripe,
  ) {}

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const session = await this.stripe.checkout.sessions.create(
      {
        success_url: input.successUrl,
        return_url: input.errorUrl,
        client_reference_id: input.paymentId,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: input.currency,
              unit_amount: input.amount,
              product_data: {
                name: input.nameProduct,
              },
            },

            quantity: 1,
          },
        ],
      },
      {
        idempotencyKey: `checkout-session:${input.paymentId}`,
      },
    );

    return {
      providerCheckoutId: session.id,
      checkoutUrl: session.url!,
      expiresAt: new Date(session.expires_at),
    };
  }

  async verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedWebhookResult> {
    try {
      const result = this.stripe.webhooks.constructEvent(input.rawBody, input.signature, this.config.webhookSecret);
      console.log(result);
      await Promise.resolve();
      return {
        providerPaymentId: '1322',
        status: PaymentStatus.SUCCESS,
        rawPayload: { maks: 1 },
      };
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }
  }
  //
  // async refund(input: RefundPaymentInput): Promise<RefundPaymentResult> {
  //   return Promise.resolve({}) as RefundPaymentResult;
  // }
}
