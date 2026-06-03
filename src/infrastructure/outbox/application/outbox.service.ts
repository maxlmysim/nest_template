import { Inject, Injectable } from '@nestjs/common';
import { InjectOutboxRepository } from '../outbox.tokens';
import type { OutboxRepository } from './interfaces/outbox-repository.interface';
import type { CreateOutboxEventInput, OutboxEventName } from '../outbox.types';
import type { Outbox } from './interfaces/outbox.interface';

@Injectable()
export class OutboxService implements Outbox {
  constructor(
    @Inject(InjectOutboxRepository)
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async createEvent<T extends OutboxEventName>(inout: CreateOutboxEventInput<T>) {
    await this.outboxRepository.create(inout);
  }
}
