import { Kysely, Transaction } from 'kysely';
import { DB } from './generated/database.types';

export type DatabaseClient = Kysely<DB>;
export type TransactionClient = Transaction<DB>;

export type DbClient = DatabaseClient | TransactionClient;
