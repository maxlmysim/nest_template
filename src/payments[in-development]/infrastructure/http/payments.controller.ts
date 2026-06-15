import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PAYMENTS_PORT } from '../../payments.tokens';
import type { PaymentsPort } from '../../domain/ports/payments/payments.port';
import { PaymentCurrency } from '../../domain/enums/payment-currency.enum';

@Controller('payments')
export class PaymentsController {
  constructor(@Inject(PAYMENTS_PORT) private readonly port: PaymentsPort) {}

  @Get('')
  private get(@Query('amountMinor') amountMinor: string) {
    return this.port.createCheckoutPayment({
      currency: PaymentCurrency.EUR,
      description: 'hello description',
      amountMinor: Number(amountMinor),
      successUrl: 'https://docs.stripe.com/api/expanding_objects',
      cancelUrl: 'https://docs.stripe.com/api/expanding_objects',
      nameProduct: 'test product',
    });
  }
}
