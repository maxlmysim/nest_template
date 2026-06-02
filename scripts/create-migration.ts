import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Migration name is required.');
  console.error('Example: npm run db:migration:create create_users');
  process.exit(1);
}

const normalizeName = (name: string): string => {
  return name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
};

const createTimestamp = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const content = `import { Kysely } from 'kysely';
import { createTableWithBaseColumns } from './helpers/add-base-column';

export async function up(db: Kysely<any>): Promise<void> {
   await createTableWithBaseColumns(db, 'outbox_event', (table) =>
    table
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  // Write rollback here.
}
`;

const main = async () => {
  const migrationsDir = path.resolve('src/infrastructure/database/migrations');
  await mkdir(migrationsDir, { recursive: true });

  const timestamp = createTimestamp();
  const normalizedName = normalizeName(migrationName);
  const fileName = `${timestamp}_${normalizedName}.ts`;
  const filePath = path.resolve(migrationsDir, fileName);

  await writeFile(filePath, content, { flag: 'wx' });

  console.log(`Created migration: ${filePath}`);
};

void main();
