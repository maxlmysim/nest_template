import {
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  type Provider,
} from '@nestjs/common';
import { KYSELY_DB } from './database.tokens';
import { DatabaseProvider } from './database.provider';
import type { DbClient } from './database-client.type';
import { InjectTransactionManager } from './transaction/transaction-manager.interface';
import { KyselyTransactionManager } from './transaction/kysely-transaction-manager';
import { TransactionContextService } from './transaction/transaction-context.service';
import { DbContextService } from './transaction/db-context.service';

const transactionProvider: Provider = {
  provide: InjectTransactionManager,
  useClass: KyselyTransactionManager,
};

@Global()
@Module({
  providers: [
    DatabaseProvider,
    transactionProvider,
    TransactionContextService,
    DbContextService,
  ],
  exports: [KYSELY_DB, InjectTransactionManager, TransactionContextService],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(KYSELY_DB) private readonly db: DbClient) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
