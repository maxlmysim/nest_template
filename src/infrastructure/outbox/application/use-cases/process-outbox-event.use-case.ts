import { Inject, Injectable, Logger } from '@nestjs/common';
import type { UseCase } from '../../../../shared/application/use-case.interface';
import { InjectOutboxRepository } from '../../outbox.tokens';
import type { OutboxRepository } from '../interfaces/outbox-repository.interface';
import { DiscoveryOutboxHandlerRegistry } from '../../infrastructure/handlers/discovery-outbox-handler.registry';
import type { OutboxEvent } from '../../outbox.types';
import { OutboxRetryPolicyService } from '../outbox-retry-policy.service';

@Injectable()
export class ProcessOutboxEventUseCase implements UseCase<void, void> {
  private readonly logger = new Logger(ProcessOutboxEventUseCase.name);

  constructor(
    @Inject(InjectOutboxRepository)
    private readonly outboxRepository: OutboxRepository,
    private readonly outboxHandlers: DiscoveryOutboxHandlerRegistry,
    private readonly retryPolicyService: OutboxRetryPolicyService,
  ) {}

  async execute() {
    const events = await this.outboxRepository.claimAvailableForProcessing({
      limit: 10,
    });

    await Promise.all(events.map(async (event) => this.processSingle(event)));
  }

  private async processSingle(event: OutboxEvent) {
    const handler = this.outboxHandlers.get(event.eventType);

    if (!handler) {
      const errorMessage = `No handler for event with name ${event.eventType}`;
      this.logger.error(errorMessage);
      await this.scheduleRetryOrDead(event, errorMessage);
      return;
    }

    try {
      await handler.handle(event.payload);

      await this.outboxRepository.markAsCompleted(event.id);
    } catch (err) {
      this.logger.error(`Handler "${event.eventType}" failed (event ${event.id})`, err);

      await this.scheduleRetryOrDead(event, err instanceof Error ? err.message : String(err));
    }
  }

  private async scheduleRetryOrDead(event: OutboxEvent, errorMessage: string) {
    const { nextRetryAt, isDead } = this.retryPolicyService.decide({
      attempts: event.attempts,
      maxAttempts: event.maxAttempts,
    });

    await this.outboxRepository.markAsFailed(event.id, {
      errorMessage,
      nextRetryAt,
      isDead,
    });
  }
}
