import type { OutboxEventHandler } from '../../../infrastructure/outbox/application/interfaces/outbox-event-handler.interface';
import { USER_CREATED, type UserCreated } from '../../domain/events/user-created.outbox-event';
import type { OutboxEventPayloadMap } from '../../../infrastructure/outbox/outbox.types';
import { OutboxHandler } from '../../../infrastructure/outbox/infrastructure/handlers/outbox-handler.decorator';

@OutboxHandler()
export class UserCreatedHandler implements OutboxEventHandler<UserCreated> {
  readonly eventType = USER_CREATED;

  constructor() {}

  async handle(payload: OutboxEventPayloadMap[UserCreated]) {
    const { name, id } = payload;

    return Promise.resolve();
  }
}
