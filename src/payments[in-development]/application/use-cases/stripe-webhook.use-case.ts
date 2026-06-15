import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared/application/use-case.interface';
import { PaymentProviderFactory } from '../services/payment-provider.factory';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

type ExecuteInput = {
  rawBody: Buffer;
  signature: string;
};

@Injectable()
export class StripeWebhookUseCase implements UseCase<ExecuteInput, void> {
  constructor(private readonly paymentProviderFactory: PaymentProviderFactory) {}

  async execute(input: ExecuteInput): Promise<void> {
    const provider = this.paymentProviderFactory.get(PaymentProvider.STRIPE);

    await provider.verifyWebhook(input);
  }
}
