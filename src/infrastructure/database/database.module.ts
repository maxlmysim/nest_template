import {
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  type Provider,
} from '@nestjs/common';
import { InjectTransactionalManager, InjectKyselyDb } from './database.tokens';
import { DatabaseProvider } from './database.provider';
import type { DbClient } from './database-client.type';
import { KyselyTransactionManager } from './transaction/kysely-transaction-manager';
import { TransactionContextService } from './transaction/transaction-context.service';
import { DbContextService } from './transaction/db-context.service';

const transactionProvider: Provider = {
  provide: InjectTransactionalManager,
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
  exports: [InjectTransactionalManager, DbContextService],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(InjectKyselyDb) private readonly db: DbClient) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
