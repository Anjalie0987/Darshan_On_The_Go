/**
 * Safely builds an SQL INSERT statement from an object.
 */
export function buildInsertQuery(tableName: string, data: Record<string, any>): { query: string; values: any[] } {
  const keys = Object.keys(data).filter(key => data[key] !== undefined);
  const values = keys.map(key => data[key]);
  
  const columns = keys.map(k => `"${k}"`).join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  
  return {
    query: `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values,
  };
}

/**
 * Safely builds an SQL UPDATE SET clause from an object.
 */
export function buildUpdateQuery(
  tableName: string, 
  idField: string, 
  idValue: any, 
  data: Record<string, any>
): { query: string; values: any[] } {
  const keys = Object.keys(data).filter(key => data[key] !== undefined);
  
  if (keys.length === 0) {
    throw new Error('No data provided for update');
  }

  const values = keys.map(key => data[key]);
  values.push(idValue); // ID is the last parameter

  const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
  const idPlaceholder = `$${values.length}`;
  
  return {
    query: `UPDATE ${tableName} SET ${setClause} WHERE "${idField}" = ${idPlaceholder} RETURNING *`,
    values,
  };
}

/**
 * Safely builds a simple AND-joined WHERE clause.
 */
export function buildWhereClause(
  filters: Record<string, any>, 
  startIndex = 1
): { clause: string; values: any[] } {
  const keys = Object.keys(filters).filter(key => filters[key] !== undefined);
  
  if (keys.length === 0) {
    return { clause: '', values: [] };
  }

  const values = keys.map(key => filters[key]);
  const conditions = keys.map((key, index) => `"${key}" = $${startIndex + index}`).join(' AND ');
  
  return {
    clause: `WHERE ${conditions}`,
    values,
  };
}
