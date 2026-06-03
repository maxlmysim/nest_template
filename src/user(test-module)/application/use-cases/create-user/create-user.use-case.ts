import type { UseCase } from '../../../../shared/application/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { InjectTransactionalManager } from '../../../../infrastructure/database/database.tokens';
import type { TransactionManager } from '../../../../infrastructure/database/transaction/transaction-manager.interface';
import { InjectOutbox } from '../../../../infrastructure/outbox/outbox.tokens';
import type { Outbox } from '../../../../infrastructure/outbox/application/interfaces/outbox.interface';
import { USER_CREATED } from '../../../domain/events/user-created.outbox-event';

@Injectable()
export class CreateUserUseCase implements UseCase<void, void> {
  constructor(
    @Inject(InjectTransactionalManager) private readonly transactionManager: TransactionManager,
    @Inject(InjectOutbox) private readonly outbox: Outbox,
  ) {}

  async execute(): Promise<void> {
    await this.transactionManager.run(async () => {
      //   some logic

      await this.outbox.createEvent({
        eventType: USER_CREATED,
        payload: { id: '123456', name: 'Maks' },
        aggregate: {
          aggregateId: '123456',
          aggregateType: 'outbox_event', // here name user table
        },
      });
    });

    return Promise.resolve();
  }
}
