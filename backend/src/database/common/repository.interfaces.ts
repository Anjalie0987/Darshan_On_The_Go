import { PoolClient } from 'pg';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryRunner {
  query(queryText: string, params?: any[]): Promise<any>;
}

export type DbClient = PoolClient | QueryRunner;
