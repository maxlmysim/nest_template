import { AggregateName } from './outbox.constants';
import { OutboxEventPayloadMapTypes } from './outbox-event.registry';

export type OutboxEventName = keyof OutboxEventPayloadMapTypes;

export type OutboxEventPayloadMap = {
  [K in OutboxEventName]: OutboxEventPayloadMapTypes[K];
};

type AggregateRef = {
  aggregateType?: (typeof AggregateName)[keyof typeof AggregateName];
  aggregateId?: string;
};

export type OutboxEventByName<T extends OutboxEventName> = {
  id: string;
  eventType: T;
  payload: OutboxEventPayloadMap[T];
  attempts: number;
  maxAttempts: number;
};

export type OutboxEvent<T extends OutboxEventName = OutboxEventName> = T extends OutboxEventName
  ? OutboxEventByName<T>
  : never;

export type ClaimPendingOutboxEventsInput = {
  limit: number;
};

export type CreateOutboxEventInput<T extends OutboxEventName = OutboxEventName> = Pick<
  OutboxEvent<T>,
  'eventType' | 'payload'
> & {
  aggregate?: AggregateRef;
  maxAttempts?: number;
  idempotencyKey?: string;
};

export type MarkOutboxEventAsFailedInput = {
  errorMessage: string;
  nextRetryAt: Date;
  isDead?: boolean;
};
