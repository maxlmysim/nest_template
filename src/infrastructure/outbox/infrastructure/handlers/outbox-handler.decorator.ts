import { SetMetadata } from '@nestjs/common';

export const OUTBOX_HANDLER_METADATA = 'outbox:handler';

export const OutboxHandler = (): ClassDecorator => SetMetadata(OUTBOX_HANDLER_METADATA, true);
