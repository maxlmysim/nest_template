import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentCurrency } from '../../enums/payment-currency.enum';

export type CreateCheckoutInput = {
  paymentId: string;
  amount: number;
  currency: PaymentCurrency;
  nameProduct: string;
  description?: string;
  successUrl: string;
  errorUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
};

export type CreateCheckoutResult = {
  providerCheckoutId: string;
  checkoutUrl: string;
  expiresAt?: Date;
};

export type RefundPaymentInput = {
  providerPaymentId: string;
  amount?: number;
  reason?: string;
};

export type RefundPaymentResult = {
  providerRefundId: string;
  status: PaymentStatus;
};

export type VerifyWebhookInput = {
  rawBody: Buffer;
  signature: string;
};

export type VerifiedWebhookResult = {
  providerPaymentId: string;
  status: PaymentStatus;
  rawPayload: unknown;
};
