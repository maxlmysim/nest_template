import { Inject, Injectable } from '@nestjs/common';
import type { TransactionManager } from './transaction-manager.interface';
import { TransactionContextService } from './transaction-context.service';
import type { DbClient } from '../database-client.type';
import { InjectKyselyDb } from '../database.tokens';

@Injectable()
export class KyselyTransactionManager implements TransactionManager {
  constructor(
    private readonly transactionContext: TransactionContextService<DbClient>,
    @Inject(InjectKyselyDb) private readonly db: DbClient,
  ) {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    return this.db.transaction().execute(async (trx) => {
      return this.transactionContext.run(trx, callback);
    });
  }
}
