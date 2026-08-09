import {
  DatabaseException,
  UniqueConstraintViolationException,
  ForeignKeyViolationException,
  DatabaseConnectionException,
} from './database.errors';

/**
 * Parses raw PostgreSQL errors into meaningful application exceptions.
 */
export function parseDatabaseError(error: any): never {
  // Check if it's a known PostgreSQL error code
  if (error && error.code) {
    switch (error.code) {
      case '23505': // unique_violation
        throw new UniqueConstraintViolationException(
          `Unique constraint violation: ${error.detail || error.message}`,
          error,
        );
      case '23503': // foreign_key_violation
        throw new ForeignKeyViolationException(
          `Foreign key violation: ${error.detail || error.message}`,
          error,
        );
      case '08000': // connection_exception
      case '08003': // connection_does_not_exist
      case '08006': // connection_failure
      case '57P01': // admin_shutdown
      case '57P02': // crash_shutdown
      case '57P03': // cannot_connect_now
        throw new DatabaseConnectionException(
          `Database connection error: ${error.message}`,
          error,
        );
      default:
        // For other PG errors, wrap in a generic DatabaseException
        throw new DatabaseException(`Database error: ${error.message}`, error);
    }
  }

  // If it's already one of our custom exceptions, re-throw it
  if (error instanceof DatabaseException) {
    throw error;
  }

  // If it's not a known PG error but still an Error instance
  if (error instanceof Error) {
    throw new DatabaseException(error.message, error);
  }

  // Fallback
  throw new DatabaseException('An unexpected database error occurred', error);
}
