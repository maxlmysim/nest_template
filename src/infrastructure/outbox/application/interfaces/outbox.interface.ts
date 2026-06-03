import type { CreateOutboxEventInput, OutboxEventName } from '../../outbox.types';

export interface Outbox {
  createEvent<T extends OutboxEventName>(inout: CreateOutboxEventInput<T>): Promise<void>;
}
