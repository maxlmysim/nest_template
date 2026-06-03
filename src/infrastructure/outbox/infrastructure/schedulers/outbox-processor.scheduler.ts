import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProcessOutboxEventUseCase } from '../../application/use-cases/process-outbox-event.use-case';

@Injectable()
export class OutboxProcessorScheduler {
  constructor(private readonly processOutboxEvent: ProcessOutboxEventUseCase) {}

  @Cron('*/5 * * * * *')
  async processOutboxEvents() {
    await this.processOutboxEvent.execute();
  }
}
