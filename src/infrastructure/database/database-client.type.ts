import { Kysely } from 'kysely';
import { DB } from './generated/database.types';

export type DbClient = Kysely<DB>;
