import { Injectable, type OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import type { OutboxEventName } from '../../outbox.types';
import type { OutboxEventHandler } from '../../application/interfaces/outbox-event-handler.interface';
import { OUTBOX_HANDLER_METADATA } from './outbox-handler.decorator';

@Injectable()
export class DiscoveryOutboxHandlerRegistry implements OnModuleInit {
  private readonly handlers = new Map<OutboxEventName, OutboxEventHandler>();

  constructor(private readonly discovery: DiscoveryService) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders();

    for (const wrapper of wrappers) {
      const instance = wrapper.instance as OutboxEventHandler | undefined;

      if (!instance || typeof instance.handle !== 'function') {
        continue;
      }

      const isHandlerOutbox = Reflect.getMetadata(OUTBOX_HANDLER_METADATA, instance.constructor) as boolean | undefined;

      if (!isHandlerOutbox) {
        continue;
      }

      if (this.handlers.has(instance.eventType)) {
        throw new Error(`Duplicate outbox handler for event ${instance.eventType}`);
      }

      this.handlers.set(instance.eventType, instance);
    }
  }

  get(eventType: OutboxEventName) {
    return this.handlers.get(eventType);
  }
}
