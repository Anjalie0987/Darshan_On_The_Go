import { DatabaseService } from '../database.service';
import { DbClient } from '../common/repository.interfaces';
import { buildInsertQuery, buildUpdateQuery } from '../common/query.helper';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: DatabaseService,
    protected readonly tableName: string,
    protected readonly primaryKey: string = 'id',
  ) {}

  /**
   * Helper to resolve the correct query runner (useful for transactions)
   */
  protected getClient(client?: DbClient): DbClient {
    return client || this.db;
  }

  async findById(id: any, client?: DbClient): Promise<T | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM ${this.tableName} WHERE "${this.primaryKey}" = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async exists(id: any, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT 1 FROM ${this.tableName} WHERE "${this.primaryKey}" = $1 LIMIT 1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async delete(id: any, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `DELETE FROM ${this.tableName} WHERE "${this.primaryKey}" = $1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async create(data: Partial<T>, client?: DbClient): Promise<T> {
    const runner = this.getClient(client);
    const { query, values } = buildInsertQuery(this.tableName, data);
    const result = await runner.query(query, values);
    return result.rows[0];
  }

  async update(id: any, data: Partial<T>, client?: DbClient): Promise<T | null> {
    const runner = this.getClient(client);
    const { query, values } = buildUpdateQuery(this.tableName, this.primaryKey, id, data);
    const result = await runner.query(query, values);
    return result.rows[0] || null;
  }
}
