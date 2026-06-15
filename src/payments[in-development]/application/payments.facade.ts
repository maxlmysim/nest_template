import { Injectable } from '@nestjs/common';
import { PaymentsPort } from '../domain/ports/payments/payments.port';
import {
  CreateCheckoutPaymentInput,
  CreateCheckoutPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
} from '../domain/ports/payments/payments.types';
import { CreateCheckoutPaymentUseCase } from './use-cases/create-checkout-payment.use-case';
import { RefundPaymentUseCase } from './use-cases/refund-payment.use-case';

@Injectable()
export class PaymentsFacade implements PaymentsPort {
  constructor(
    private readonly createCheckoutPaymentUseCase: CreateCheckoutPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {}

  async createCheckoutPayment(input: CreateCheckoutPaymentInput): Promise<CreateCheckoutPaymentResult> {
    return this.createCheckoutPaymentUseCase.execute(input);
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return this.refundPaymentUseCase.execute(input);
  }
}
