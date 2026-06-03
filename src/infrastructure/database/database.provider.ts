import { Provider } from '@nestjs/common';
import { InjectKyselyDb } from './database.tokens';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DbClient } from './database-client.type';
import type { DB } from './generated/database.types';

export const DatabaseProvider: Provider = {
  provide: InjectKyselyDb,
  useFactory: (configService: ConfigService): DbClient => {
    const pool = new Pool({
      host: configService.getOrThrow<string>('DB_HOST'),
      port: Number(configService.getOrThrow<string>('DB_PORT')),
      database: configService.getOrThrow<string>('DB_NAME'),
      user: configService.getOrThrow<string>('DB_USER'),
      password: configService.getOrThrow<string>('DB_PASSWORD'),

      max: Number(configService.get<string>('DB_POOL_MAX') ?? 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool,
      }),
    });
  },
  inject: [ConfigService],
};
