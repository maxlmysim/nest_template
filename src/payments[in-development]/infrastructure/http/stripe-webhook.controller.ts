import { BadRequestException, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { StripeWebhookUseCase } from '../../application/use-cases/stripe-webhook.use-case';

@Controller('payments/webhooks')
export class PaymentWebhookController {
  constructor(private readonly stripeWebhookUseCase: StripeWebhookUseCase) {}

  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature?: string) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    await this.stripeWebhookUseCase.execute({
      rawBody: req.rawBody,
      signature,
    });

    return { received: true };
  }
}
