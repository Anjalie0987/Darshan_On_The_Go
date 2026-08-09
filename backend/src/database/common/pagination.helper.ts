import { PaginationParams, PaginatedResult } from './repository.interfaces';

export function buildPaginationClause(params: PaginationParams): string {
  const limit = Math.max(1, params.limit || 10);
  const page = Math.max(1, params.page || 1);
  const offset = (page - 1) * limit;
  
  let clause = '';
  
  if (params.sortBy) {
    const direction = params.sortDesc ? 'DESC' : 'ASC';
    // Prevent SQL injection by stripping non-alphanumeric chars for column names
    const safeSortBy = params.sortBy.replace(/[^a-zA-Z0-9_]/g, '');
    clause += ` ORDER BY "${safeSortBy}" ${direction}`;
  }
  
  clause += ` LIMIT ${limit} OFFSET ${offset}`;
  
  return clause;
}

export function formatPaginatedResult<T>(
  data: T[], 
  totalCount: number, 
  params: PaginationParams
): PaginatedResult<T> {
  const limit = Math.max(1, params.limit || 10);
  const page = Math.max(1, params.page || 1);
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    data,
    total: Number(totalCount),
    page,
    limit,
    totalPages,
  };
}
