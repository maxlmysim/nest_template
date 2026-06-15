import { Module, Provider } from '@nestjs/common';
import { PaymentProviderFactory } from './application/services/payment-provider.factory';
import { stripeProviders } from './infrastructure/providers/stripe/stripe.providers';
import { PaymentsFacade } from './application/payments.facade';
import { PAYMENTS_PORT } from './payments.tokens';
import { CreateCheckoutPaymentUseCase } from './application/use-cases/create-checkout-payment.use-case';
import { PaymentProviderResolver } from './application/services/payment-provider.resolver';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentsController } from './infrastructure/http/payments.controller';
import { PaymentWebhookController } from './infrastructure/http/stripe-webhook.controller';
import { StripeWebhookUseCase } from './application/use-cases/stripe-webhook.use-case';

const paymentsFacade: Provider = {
  provide: PAYMENTS_PORT,
  useClass: PaymentsFacade,
};

const useCases: Provider[] = [CreateCheckoutPaymentUseCase, RefundPaymentUseCase, StripeWebhookUseCase];

const controllers = [PaymentsController, PaymentWebhookController];

@Module({
  providers: [PaymentProviderFactory, ...stripeProviders, paymentsFacade, ...useCases, PaymentProviderResolver],
  controllers,
  exports: [PAYMENTS_PORT],
})
export class PaymentsModule {}
