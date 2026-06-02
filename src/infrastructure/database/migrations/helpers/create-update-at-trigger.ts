import { Kysely, sql } from 'kysely';

export const createUpdatedAtTrigger = async (
  db: Kysely<any>,
  tableName: string,
) => {
  const triggerName = `${tableName}_set_updated_at`;

  await sql`
    CREATE TRIGGER ${sql.id(triggerName)}
      BEFORE UPDATE ON ${sql.id(tableName)}
      FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
  `.execute(db);
};
