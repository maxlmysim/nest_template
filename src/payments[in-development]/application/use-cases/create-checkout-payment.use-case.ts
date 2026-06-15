import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared/application/use-case.interface';
import { PaymentProviderResolver } from '../services/payment-provider.resolver';
import { PaymentProviderFactory } from '../services/payment-provider.factory';
import { CreateCheckoutPaymentInput, CreateCheckoutPaymentResult } from '../../domain/ports/payments/payments.types';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

@Injectable()
export class CreateCheckoutPaymentUseCase implements UseCase<CreateCheckoutPaymentInput, CreateCheckoutPaymentResult> {
  constructor(
    private readonly providerResolver: PaymentProviderResolver,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  async execute(input: CreateCheckoutPaymentInput): Promise<CreateCheckoutPaymentResult> {
    const resolveProvider = await this.providerResolver.resolve({ requestedProvider: input.provider });
    const targetProvider = this.paymentProviderFactory.get(resolveProvider);

    const result = await targetProvider.createCheckout({
      paymentId: Date.now().toString(),
      successUrl: input.successUrl,
      amount: input.amountMinor,
      currency: input.currency,
      description: input.description,
      metadata: input.metadata,
      nameProduct: input.nameProduct,
    });

    return result as unknown as CreateCheckoutPaymentResult;
  }
}
