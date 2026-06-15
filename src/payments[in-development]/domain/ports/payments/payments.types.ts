import { PaymentCurrency } from '../../enums/payment-currency.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentProvider } from '../../enums/payment-provider.enum';

export type CreateCheckoutPaymentInput = {
  amountMinor: number;
  currency: PaymentCurrency;
  nameProduct: string;
  description?: string;

  successUrl: string;
  cancelUrl: string;

  provider?: PaymentProvider;

  metadata?: Record<string, unknown>;
};

export type CreateCheckoutPaymentResult = {
  paymentId: string;
  checkoutUrl: string;
};

export type RefundPaymentInput = {
  paymentId: string;

  /**
   * Если не передать — полный refund.
   * Если передать — частичный refund.
   */
  amountMinor?: number;

  reason?: string;
};

export type RefundPaymentResult = {
  refundId: string;
  paymentId: string;
  status: PaymentStatus;
};
