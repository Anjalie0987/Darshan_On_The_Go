import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { DbClient } from '../common/repository.interfaces';

export interface GlobalSetting {
  key: string;
  value: any;
  type: string;
  description: string | null;
}

@Injectable()
export class GlobalSettingsRepository {
  constructor(private readonly db: DatabaseService) {}

  protected getClient(client?: DbClient): DbClient {
    return client || this.db;
  }

  async getByKey(key: string, client?: DbClient): Promise<any | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT value FROM global_settings WHERE key = $1`,
      [key]
    );
    return result.rows[0]?.value || null;
  }

  async setByKey(key: string, value: any, type: string, description?: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `INSERT INTO global_settings (key, value, type, description) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO UPDATE 
       SET value = EXCLUDED.value, type = EXCLUDED.type, description = COALESCE(EXCLUDED.description, global_settings.description)`,
      [key, JSON.stringify(value), type, description]
    );
  }
}
