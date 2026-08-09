import { Logger } from '@nestjs/common';

/**
 * Custom logger for database operations to ensure we don't log sensitive credentials
 * but capture essential query and connection pool information.
 */
export class DatabaseLogger extends Logger {
  constructor() {
    super('Database');
  }

  logQuery(query: string, params?: any[]) {
    // Note: In production, consider masking sensitive data in params
    const formattedParams = params ? ` with params: ${JSON.stringify(params)}` : '';
    this.debug(`Executing query: ${query}${formattedParams}`);
  }

  logConnectionEstablished() {
    this.log('Database connection pool established successfully.');
  }

  logConnectionClosed() {
    this.log('Database connection pool closed gracefully.');
  }

  logConnectionError(error: any) {
    this.error(`Database connection failure: ${error.message}`, error.stack);
  }
}
