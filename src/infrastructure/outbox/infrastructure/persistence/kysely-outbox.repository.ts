import { Injectable } from '@nestjs/common';
import type { OutboxRepository } from '../../application/interfaces/outbox-repository.interface';
import type {
  ClaimPendingOutboxEventsInput,
  CreateOutboxEventInput,
  MarkOutboxEventAsFailedInput,
  OutboxEvent,
} from '../../outbox.types';
import { OutboxEventMapper } from './outbox-event.mapper';
import { sql } from 'kysely';
import { OUTBOX_EVENT_STATUS } from '../../domain/outbox-status.enum';
import { DbContextService } from '../../../database/transaction/db-context.service';

@Injectable()
export class KyselyOutboxRepository implements OutboxRepository {
  constructor(private readonly dbContext: DbContextService) {}

  async create(input: CreateOutboxEventInput): Promise<void> {
    await this.dbContext.executor().insertInto('outbox_event').values(OutboxEventMapper.toInsertRow(input)).execute();
  }

  async claimAvailableForProcessing(input: ClaimPendingOutboxEventsInput): Promise<OutboxEvent[]> {
    const pendingEvents = await this.dbContext
      .executor()
      .updateTable('outbox_event')
      .set((eb) => ({
        status: OUTBOX_EVENT_STATUS.PROCESSING,
        processing_started_at: new Date(),
        attempts: eb('attempts', '+', 1),
      }))
      .where('id', 'in', (eb) =>
        eb
          .selectFrom('outbox_event')
          .select('id')
          .where((eb) =>
            eb.or([
              eb('status', '=', OUTBOX_EVENT_STATUS.PENDING),
              eb.and([
                eb('status', '=', OUTBOX_EVENT_STATUS.FAILED),

                eb('attempts', '<', eb.ref('max_attempts')),
                eb('next_retry_at', '<', sql<Date>`now()`),
              ]),
              eb.and([
                eb('status', '=', OUTBOX_EVENT_STATUS.PROCESSING),
                eb('processing_started_at', '<', sql<Date>`now() - interval '10 minutes'`),
              ]),
            ]),
          )

          .forUpdate()
          .skipLocked()
          .orderBy('created_at', 'asc')
          .limit(input.limit),
      )
      .returningAll()
      .execute();

    return OutboxEventMapper.toDomainList(pendingEvents);
  }

  async markAsCompleted(id: string): Promise<void> {
    await this.dbContext
      .executor()
      .updateTable('outbox_event')
      .set({
        status: OUTBOX_EVENT_STATUS.PUBLISHED,
        completed_at: new Date(),
      })
      .where('id', '=', id)
      .execute();
  }

  async markAsFailed(id: string, input: MarkOutboxEventAsFailedInput): Promise<void> {
    await this.dbContext
      .executor()
      .updateTable('outbox_event')
      .set({
        last_error_at: new Date(),
        status: sql`CASE 
                        WHEN attemps < max_attempts 
                        THEN ${OUTBOX_EVENT_STATUS.FAILED} ELSE ${OUTBOX_EVENT_STATUS.DEAD} 
                    END`,
        ...OutboxEventMapper.toUpdateRowFailed(input),
      })
      .where('id', '=', id)
      .execute();
  }
}
