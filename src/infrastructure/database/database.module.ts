import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { KYSELY_DB } from './database.tokens';
import { DatabaseProvider } from './database.provider';
import type { DatabaseClient } from './database-client.type';

@Module({
  providers: [DatabaseProvider],
  exports: [KYSELY_DB],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(KYSELY_DB) private readonly db: DatabaseClient) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
