import {
  CreateCheckoutInput,
  CreateCheckoutResult,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifiedWebhookResult,
  VerifyWebhookInput,
} from './payment-provider.types';

export interface PaymentProviderPort {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;

  verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedWebhookResult>;
  //
  // refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
