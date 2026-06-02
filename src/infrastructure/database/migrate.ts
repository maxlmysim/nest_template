import 'dotenv/config';
import * as path from 'node:path';
import { promises as fs } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { Kysely, PostgresDialect } from 'kysely';
import { MigrationProvider, Migration } from 'kysely/migration';
import { Migrator } from 'kysely/migration';
import { Pool } from 'pg';

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

class TsFileMigrationProvider implements MigrationProvider {
  constructor(private readonly migrationFolder: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const files = await fs.readdir(this.migrationFolder);

    const migrations: Record<string, Migration> = {};

    for (const fileName of files) {
      if (!fileName.endsWith('.ts') && !fileName.endsWith('.js')) {
        continue;
      }

      const fullPath = path.join(this.migrationFolder, fileName);
      const url = pathToFileURL(fullPath).href;

      const migrationModule = (await import(url)) as Migration;

      const migrationName = fileName.replace(/\.(ts|js)$/, '');

      migrations[migrationName] = {
        up: (db) => migrationModule.up(db),
        down: migrationModule.down
          ? (db) => migrationModule.down!(db)
          : undefined,
      };
    }

    return migrations;
  }
}

async function migrateToLatest(): Promise<void> {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: getRequiredEnv('DB_HOST'),
        port: Number(process.env.DB_PORT ?? 5432),
        database: getRequiredEnv('DB_NAME'),
        user: getRequiredEnv('DB_USER'),
        password: getRequiredEnv('DB_PASSWORD'),
      }),
    }),
  });

  const migrationFolder = path.resolve(
    'src/infrastructure/database/migrations',
  );

  const migrator = new Migrator({
    db,
    provider: new TsFileMigrationProvider(migrationFolder),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`Migration "${result.migrationName}" executed successfully`);
    }

    if (result.status === 'Error') {
      console.error(`Migration "${result.migrationName}" failed`);
    }
  });

  await db.destroy();

  if (error) {
    console.error('Migration failed');
    console.error(error);
    process.exit(1);
  }

  console.log('Migrations completed');
}

void migrateToLatest();
