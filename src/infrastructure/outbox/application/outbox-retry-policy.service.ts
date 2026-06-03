import { Injectable } from '@nestjs/common';
import { MAX_ATTEMPTS } from '../outbox.constants';

export const OUTBOX_RETRY_DELAYS_MS = [
  60_000, // 1 min
  5 * 60_000, // 5 min
  15 * 60_000, // 15 min
  30 * 60_000, // 30 min
  3 * 60 * 60_000, // 3 hours
  5 * 60 * 60_000, // 5 hours
  10 * 60 * 60_000, // 10 hours
] as const;

type RetryDecision =
  | {
      isDead: true;
      nextRetryAt: Date;
    }
  | {
      isDead: false;
      nextRetryAt: Date;
    };

@Injectable()
export class OutboxRetryPolicyService {
  constructor() {}

  decide(input: { attempts: number }): RetryDecision {
    const { attempts } = input;

    if (attempts >= MAX_ATTEMPTS) {
      return {
        isDead: true,
        nextRetryAt: new Date(),
      };
    }

    const nowMs = Date.now();
    const debounceMs = OUTBOX_RETRY_DELAYS_MS[attempts] || OUTBOX_RETRY_DELAYS_MS[0];
    const nextRetryAt = new Date(nowMs + this.applyJitter(debounceMs));

    return {
      isDead: false,
      nextRetryAt,
    };
  }

  private applyJitter(delayMs: number, jitterPercent = 0.2) {
    const jitterMs = delayMs * jitterPercent;

    const min = delayMs - jitterMs;
    const max = delayMs + jitterMs;

    return Math.floor(Math.random() * (max - min) + min);
  }
}
