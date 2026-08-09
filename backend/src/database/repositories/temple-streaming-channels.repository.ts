import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface TempleStreamingChannel {
  id: string;
  temple_id: string;
  provider_id: number;
  channel_reference: string;
  channel_url: string | null;
  channel_name: string | null;
  channel_thumbnail: string | null;
  subscriber_count: number | null;
  is_primary: boolean;
  priority: number;
  api_status: 'HEALTHY' | 'ERROR' | 'QUOTA_EXCEEDED';
  is_active: boolean;
  last_sync_at: Date | null;
  deleted_at: Date | null;
}

@Injectable()
export class TempleStreamingChannelsRepository extends BaseRepository<TempleStreamingChannel> {
  constructor(db: DatabaseService) {
    super(db, 'temple_streaming_channels');
  }

  async findByTempleId(templeId: string, client?: DbClient): Promise<TempleStreamingChannel[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temple_streaming_channels WHERE temple_id = $1 AND deleted_at IS NULL ORDER BY priority DESC`,
      [templeId],
    );
    return result.rows;
  }
}
