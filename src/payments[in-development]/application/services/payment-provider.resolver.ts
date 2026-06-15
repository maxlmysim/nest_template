import { Injectable } from '@nestjs/common';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

type ResolvePaymentProviderInput = {
  requestedProvider?: PaymentProvider;

  //any optionals
};

@Injectable()
export class PaymentProviderResolver {
  constructor() {}

  async resolve(input: ResolvePaymentProviderInput): Promise<PaymentProvider> {
    await Promise.resolve() //for disable lint error

    if (input.requestedProvider) {
      return input.requestedProvider;
    }

    return PaymentProvider.STRIPE;
  }
}
