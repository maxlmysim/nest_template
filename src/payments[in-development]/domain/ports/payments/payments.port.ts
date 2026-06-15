import {
  CreateCheckoutPaymentInput,
  CreateCheckoutPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
} from './payments.types';

export interface PaymentsPort {
  createCheckoutPayment(input: CreateCheckoutPaymentInput): Promise<CreateCheckoutPaymentResult>;

  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
