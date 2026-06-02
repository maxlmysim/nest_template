import { Kysely, sql } from 'kysely';
import { createTableWithBaseColumns } from './helpers/add-base-column';

export async function up(db: Kysely<any>): Promise<void> {
  await createTableWithBaseColumns(db, 'outbox_event', (table) =>
    table
      .addColumn('event_type', 'text', (col) => col.notNull())
      .addColumn('payload', 'jsonb', (col) => col.notNull())
      .addColumn('status', 'varchar(50)', (col) =>
        col.notNull().defaultTo('PENDING'),
      ),
  );

  await sql`
    ALTER TABLE outbox_event
      ADD CONSTRAINT outbox_event_status_check
      CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'))
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('outbox_event').ifExists().execute();
}
