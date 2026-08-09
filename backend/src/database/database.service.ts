import {
  Injectable,
  Inject,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DATABASE_CONFIG } from './database.constants';
import { DatabaseEnvironmentVariables } from './database.config';
import { DatabaseLogger } from './database.logger';
import { parseDatabaseError } from './database.utils';
import { TransactionCallback, QueryParams } from './database.types';

@Injectable()
export class DatabaseService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
{
  private pool!: Pool;
  private readonly logger = new DatabaseLogger();

  constructor(
    @Inject(DATABASE_CONFIG)
    private readonly config: DatabaseEnvironmentVariables,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing database module...');
    this.pool = new Pool({
      host: this.config.DATABASE_HOST,
      port: this.config.DATABASE_PORT,
      database: this.config.DATABASE_NAME,
      user: this.config.DATABASE_USER,
      password: this.config.DATABASE_PASSWORD,
      ssl: false, // Force disabled for local environment where server does not support SSL
      min: this.config.DATABASE_POOL_MIN,
      max: this.config.DATABASE_POOL_MAX,
      idleTimeoutMillis: this.config.DATABASE_IDLE_TIMEOUT,
      connectionTimeoutMillis: this.config.DATABASE_CONNECTION_TIMEOUT,
    });

    this.pool.on('error', (err) => {
      this.logger.logConnectionError(err);
      // Allow the connection pool to handle reconnections natively
    });
  }

  async onApplicationBootstrap() {
    try {
      const client = await this.pool.connect();
      client.release();
      this.logger.logConnectionEstablished();
    } catch (error) {
      this.logger.logConnectionError(error);
      // Fast fail if database is completely unreachable at startup
      parseDatabaseError(error);
    }
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.log(`Received shutdown signal: ${signal}. Preparing to close database connections...`);
  }

  async onModuleDestroy() {
    this.logger.log('Closing database connection pool...');
    await this.pool.end();
    this.logger.logConnectionClosed();
  }

  /**
   * Executes a single query against the database pool.
   * Connection is acquired and released automatically.
   */
  async query<T extends QueryResultRow = any>(
    queryText: string,
    params?: QueryParams,
  ): Promise<QueryResult<T>> {
    this.logger.logQuery(queryText, params);
    try {
      return await this.pool.query<T>(queryText, params);
    } catch (error) {
      parseDatabaseError(error);
    }
  }

  /**
   * Executes a set of queries within a single transaction.
   * If the callback throws an error, the transaction is rolled back.
   */
  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      parseDatabaseError(error);
    } finally {
      client.release();
    }
  }

  /**
   * Provides direct access to a connected client from the pool.
   * Useful for advanced operations where keeping a connection alive is required.
   * The caller MUST ensure client.release() is called.
   */
  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      parseDatabaseError(error);
    }
  }
}
