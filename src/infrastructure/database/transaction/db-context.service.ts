import { Inject, Injectable } from '@nestjs/common';
import { TransactionContextService } from './transaction-context.service';
import type { DbClient } from '../database-client.type';
import { KYSELY_DB } from '../database.tokens';

@Injectable()
export class DbContextService {
  constructor(
    private readonly transactionContext: TransactionContextService<DbClient>,
    @Inject(KYSELY_DB) private readonly db: DbClient,
  ) {}

  executor(): DbClient {
    return this.transactionContext.getTransaction() ?? this.db;
  }
}
