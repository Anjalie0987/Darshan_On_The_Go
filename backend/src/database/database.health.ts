import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

export interface DatabaseHealthResult {
  status: 'up' | 'down';
  version?: string;
  error?: string;
  timestamp: string;
}

@Injectable()
export class DatabaseHealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Pings the database to verify connectivity and retrieves its version.
   */
  async checkHealth(): Promise<DatabaseHealthResult> {
    try {
      const result = await this.databaseService.query<{ version: string }>(
        'SELECT version()',
      );
      return {
        status: 'up',
        version: result.rows[0].version,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'down',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
