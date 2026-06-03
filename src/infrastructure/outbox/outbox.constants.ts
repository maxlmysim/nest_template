import type { DB } from '../database/generated/database.types';

export const AggregateName: Record<string, keyof DB> = {};

export const MAX_ATTEMPTS = 5;
