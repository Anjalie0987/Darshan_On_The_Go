import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { DbClient } from '../common/repository.interfaces';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly db: DatabaseService) {}

  protected getClient(client?: DbClient): DbClient {
    return client || this.db;
  }

  async recordTempleView(templeId: string, userId?: string, ipAddress?: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `INSERT INTO temple_views (temple_id, user_id, ip_address) VALUES ($1, $2, $3)`,
      [templeId, userId || null, ipAddress || null]
    );
  }

  async recordSearch(searchTerm: string, filters: any, userId?: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `INSERT INTO search_logs (search_term, filters, user_id) VALUES ($1, $2, $3)`,
      [searchTerm, JSON.stringify(filters), userId || null]
    );
  }
}
