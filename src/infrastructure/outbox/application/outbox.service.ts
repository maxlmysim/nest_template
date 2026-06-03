import { Inject, Injectable } from '@nestjs/common';
import { InjectOutboxRepository } from '../outbox.tokens';
import type { OutboxRepository } from './interfaces/outbox-repository.interface';
import type { CreateOutboxEventInput } from '../outbox.types';

@Injectable()
export class OutboxService {
  constructor(
    @Inject(InjectOutboxRepository)
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async createEvent(inout: CreateOutboxEventInput) {
    await this.outboxRepository.create(inout);
  }
}
