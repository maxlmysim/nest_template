import { Inject, Injectable } from '@nestjs/common';
import { TransactionContextService } from './transaction-context.service';
import type { DbClient } from '../database-client.type';
import { InjectKyselyDb } from '../database.tokens';

@Injectable()
export class DbContextService {
  constructor(
    private readonly transactionContext: TransactionContextService<DbClient>,
    @Inject(InjectKyselyDb) private readonly db: DbClient,
  ) {}

  executor(): DbClient {
    return this.transactionContext.getTransaction() ?? this.db;
  }
}
