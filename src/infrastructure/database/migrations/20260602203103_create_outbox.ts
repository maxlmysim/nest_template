import { Kysely, sql } from 'kysely';
import { createTableWithBaseColumns } from './helpers/add-base-column';

export async function up(db: Kysely<any>): Promise<void> {
  await createTableWithBaseColumns(db, 'outbox_event', (table) =>
    table
      .addColumn('aggregate_type', 'text')
      .addColumn('aggregate_id', 'text')
      .addColumn('idempotency_key', 'text', (col) => col.unique())
      .addColumn('event_type', 'text', (col) => col.notNull())
      .addColumn('payload', 'jsonb', (col) => col.notNull())
      .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('PENDING'))
      .addColumn('processing_started_at', 'timestamptz')
      .addColumn('completed_at', 'timestamptz')
      .addColumn('last_error_at', 'timestamptz')
      .addColumn('error_message', 'text')
      .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
      .addColumn('next_retry_at', 'timestamptz'),
  );

  await sql`
    ALTER TABLE outbox_event
      ADD CONSTRAINT outbox_event_status_check
      CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'DEAD'))
  `.execute(db);

  await sql`
    ALTER TABLE outbox_event
      ADD CONSTRAINT outbox_event_payload_check
        CHECK ( jsonb_typeof(payload) = 'object' )`.execute(db);

  await sql`
    CREATE INDEX idx_outbox_event_pending_created_at
     ON outbox_event( created_at)
     WHERE status = 'PENDING'`.execute(db);

  await sql`
  CREATE INDEX idx_outbox_event_failed_with_retry
  ON outbox_event(next_retry_at,created_at)
   WHERE status='FAILED' 
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('outbox_event').ifExists().execute();
}
