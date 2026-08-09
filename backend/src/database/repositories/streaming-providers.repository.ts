import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface StreamingProvider {
  id: number;
  provider_name: string;
  provider_code: string;
  api_base_url: string | null;
  documentation_url: string | null;
  supports_live_detection: boolean;
  supports_embeds: boolean;
  supports_chat: boolean;
  is_active: boolean;
}

@Injectable()
export class StreamingProvidersRepository extends BaseRepository<StreamingProvider> {
  constructor(db: DatabaseService) {
    super(db, 'streaming_providers');
  }

  async findByCode(providerCode: string, client?: DbClient): Promise<StreamingProvider | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM streaming_providers WHERE provider_code = $1`,
      [providerCode],
    );
    return result.rows[0] || null;
  }
}
