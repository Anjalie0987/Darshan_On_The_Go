import { PoolClient } from 'pg';

/**
 * Type definition for a callback function executed within a database transaction.
 * The client provided is scoped to the transaction.
 */
export type TransactionCallback<T> = (client: PoolClient) => Promise<T>;

/**
 * Type definition for SQL query parameters.
 */
export type QueryParams = any[];
