import {
  RefundPaymentInput,
  RefundPaymentResult,
  VerifiedWebhookResult,
  VerifyWebhookInput,
} from '../../../domain/ports/payment-provider/payment-provider.types';

export type StripeRefundPaymentInput = RefundPaymentInput;

export type StripeRefundPaymentResult = RefundPaymentResult;

export type StripeVerifyWebhookInput = VerifyWebhookInput & {
  rawBody: {
    id: string;
  };
};

export type StripeVerifiedWebhookResult = VerifiedWebhookResult;

export type StripeConfig = {
  secretKey: string;
  webhookSecret: string;
};
