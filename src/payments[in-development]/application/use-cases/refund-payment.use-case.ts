import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared/application/use-case.interface';
import { PaymentProviderResolver } from '../services/payment-provider.resolver';
import { PaymentProviderFactory } from '../services/payment-provider.factory';
import {
  CreateCheckoutPaymentInput,
  CreateCheckoutPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
} from '../../domain/ports/payments/payments.types';

@Injectable()
export class RefundPaymentUseCase implements UseCase<RefundPaymentInput, RefundPaymentResult> {
  constructor(
    private readonly providerResolver: PaymentProviderResolver,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  async execute(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    await Promise.resolve();
    return {} as unknown as RefundPaymentResult;
  }
}
