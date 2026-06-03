import type { DB } from '../../../database/generated/database.types';
import type { Insertable, Selectable, Updateable } from 'kysely';
import type {
  CreateOutboxEventInput,
  MarkOutboxEventAsFailedInput,
  OutboxEvent,
  OutboxEventName,
  OutboxEventPayloadMap,
} from '../../outbox.types';
import { OUTBOX_EVENT_STATUS } from '../../domain/outbox-status.enum';
import { MAX_ATTEMPTS } from '../../outbox.constants';

type OutboxEventRow = Selectable<DB['outbox_event']>;
type OutboxEventInsertRow = Insertable<DB['outbox_event']>;
type OutboxEventUpdateRow = Updateable<DB['outbox_event']>;

export class OutboxEventMapper {
  static toDomain(row: OutboxEventRow): OutboxEvent {
    return {
      id: row.id,
      eventType: row.event_type as OutboxEventName,
      payload: row.payload as OutboxEventPayloadMap[OutboxEventName],
      idempotencyKey: row.idempotency_key ?? undefined,
      attempts: row.attempts ?? 0,
    };
  }

  static toDomainList(rows: OutboxEventRow[]): OutboxEvent[] {
    return rows.map((row) => OutboxEventMapper.toDomain(row));
  }

  static toInsertRow<T extends OutboxEventName>(input: CreateOutboxEventInput<T>): OutboxEventInsertRow {
    return {
      payload: input.payload,
      event_type: input.eventType,
      idempotency_key: input.idempotencyKey,
      max_attempts: input.maxAttempts ?? MAX_ATTEMPTS,
      ...(input.aggregate
        ? {
            aggregate_type: input.aggregate.aggregateType,
            aggregate_id: input.aggregate.aggregateId,
          }
        : {}),
    };
  }

  static toUpdateRowFailed(input: MarkOutboxEventAsFailedInput): OutboxEventUpdateRow {
    return {
      error_message: input.errorMessage,
      next_retry_at: input.nextRetryAt,
      ...(input.isDead ? { status: OUTBOX_EVENT_STATUS.DEAD } : {}),
    };
  }
}
