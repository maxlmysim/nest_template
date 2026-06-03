import { Module, type Provider } from '@nestjs/common';
import { OutboxProcessorScheduler } from './infrastructure/schedulers/outbox-processor.scheduler';
import { InjectOutboxRepository } from './outbox.tokens';
import { KyselyOutboxRepository } from './infrastructure/persistence/kysely-outbox.repository';
import { OutboxService } from './application/outbox.service';
import { ProcessOutboxEventUseCase } from './application/use-cases/process-outbox-event.use-case';
import { DiscoveryOutboxHandlerRegistry } from './infrastructure/handlers/discovery-outbox-handler.registry';
import { DiscoveryModule } from '@nestjs/core';
import { OutboxRetryPolicyService } from './application/outbox-retry-policy.service';

const repositories: Provider[] = [
  {
    provide: InjectOutboxRepository,
    useClass: KyselyOutboxRepository,
  },
];

const services: Provider[] = [OutboxService, OutboxRetryPolicyService];

const useCases: Provider[] = [ProcessOutboxEventUseCase];

const handlers: Provider[] = [DiscoveryOutboxHandlerRegistry];

@Module({
  imports: [DiscoveryModule],
  providers: [OutboxProcessorScheduler, ...repositories, ...services, ...useCases, ...handlers],
})
export class OutboxModule {}
