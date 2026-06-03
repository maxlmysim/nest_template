import type { OutboxEventName, OutboxEventPayloadMap } from '../../outbox.types';

export interface OutboxEventHandler<T extends OutboxEventName = OutboxEventName> {
  readonly eventType: T;

  handle: (payload: OutboxEventPayloadMap[T]) => Promise<void>;
}
