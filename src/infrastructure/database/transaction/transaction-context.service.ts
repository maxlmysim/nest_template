import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class TransactionContextService<TTransaction> {
  private readonly storage = new AsyncLocalStorage<TTransaction>();

  run<T>(transaction: TTransaction, callback: () => Promise<T>) {
    return this.storage.run(transaction, callback);
  }

  getTransaction(): TTransaction | undefined {
    return this.storage.getStore();
  }
}
