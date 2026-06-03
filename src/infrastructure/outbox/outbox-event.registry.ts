import type { UserCreatedOutboxEvent } from '../../user(test-module)/domain/events/user-created.outbox-event';

export type OutboxEventPayloadMapTypes = UserCreatedOutboxEvent; // & OrderCreatedOutboxEvent & ...;
