import type {
  ClaimPendingOutboxEventsInput,
  CreateOutboxEventInput,
  MarkOutboxEventAsFailedInput,
  OutboxEvent,
} from '../../outbox.types';

export interface OutboxRepository {
  create(input: CreateOutboxEventInput): Promise<void>;

  claimAvailableForProcessing(
    input: ClaimPendingOutboxEventsInput,
  ): Promise<OutboxEvent[]>;

  markAsCompleted(id: string): Promise<void>;

  markAsFailed(id: string, input: MarkOutboxEventAsFailedInput): Promise<void>;
}
