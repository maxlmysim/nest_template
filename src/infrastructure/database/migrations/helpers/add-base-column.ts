import { CreateTableBuilder, Kysely, sql } from 'kysely';
import { createUpdatedAtTrigger } from './create-update-at-trigger';

type TableBuilder = CreateTableBuilder<string, any>;

export async function createTableWithBaseColumns(
  db: Kysely<any>,
  tableName: string,
  build: (table: TableBuilder) => TableBuilder,
): Promise<void> {
  const table = db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    );

  await build(table).execute();

  await createUpdatedAtTrigger(db, tableName);
}
