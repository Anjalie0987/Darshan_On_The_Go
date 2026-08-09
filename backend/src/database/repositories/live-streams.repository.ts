import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface LiveStream {
  id: string;
  temple_id: string;
  channel_id: string | null;
  stream_reference: string;
  stream_url: string | null;
  embed_url: string | null;
  title: string | null;
  thumbnail_url: string | null;
  status: 'LIVE' | 'ENDED' | 'ERROR';
  status_reason: string | null;
  viewer_count: number | null;
  duration_seconds: number | null;
  started_at: Date;
  ended_at: Date | null;
  last_updated_at: Date;
}

@Injectable()
export class LiveStreamsRepository extends BaseRepository<LiveStream> {
  constructor(db: DatabaseService) {
    super(db, 'live_streams');
  }

  async findActiveStreams(client?: DbClient): Promise<LiveStream[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM live_streams WHERE status = 'LIVE'`
    );
    return result.rows;
  }

  async findActiveStreamsWithDetails(client?: DbClient): Promise<any[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT 
         ls.id as stream_id,
         ls.title as stream_title,
         ls.thumbnail_url,
         ls.stream_url,
         ls.embed_url,
         ls.started_at,
         ls.viewer_count,
         t.id as temple_id,
         t.name as temple_name,
         t.slug as temple_slug,
         c.name as temple_city,
         s.name as temple_state
       FROM live_streams ls
       JOIN temples t ON ls.temple_id = t.id
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN states s ON t.state_id = s.id
       WHERE ls.status = 'LIVE' AND t.is_active = true`
    );
    return result.rows;
  }

  async findActiveStreamByTemple(templeId: string, client?: DbClient): Promise<LiveStream | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM live_streams WHERE temple_id = $1 AND status = 'LIVE'`,
      [templeId]
    );
    return result.rows[0] || null;
  }

  async upsertStream(templeId: string, streamData: Partial<LiveStream>, client?: DbClient): Promise<LiveStream> {
    const runner = this.getClient(client);
    
    const existing = await this.findActiveStreamByTemple(templeId, runner);
    
    if (existing) {
      const result = await runner.query(
        `UPDATE live_streams 
         SET title = $1, thumbnail_url = $2, stream_url = $3, embed_url = $4, last_updated_at = NOW()
         WHERE id = $5 RETURNING *`,
        [
          streamData.title || existing.title, 
          streamData.thumbnail_url || existing.thumbnail_url, 
          streamData.stream_url || existing.stream_url, 
          streamData.embed_url || existing.embed_url, 
          existing.id
        ]
      );
      return result.rows[0];
    } else {
      const result = await runner.query(
        `INSERT INTO live_streams (temple_id, stream_reference, stream_url, embed_url, title, thumbnail_url, status, started_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'LIVE', NOW()) RETURNING *`,
        [
          templeId, 
          streamData.stream_reference, 
          streamData.stream_url, 
          streamData.embed_url, 
          streamData.title, 
          streamData.thumbnail_url
        ]
      );
      return result.rows[0];
    }
  }

  async markStreamEnded(streamId: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `UPDATE live_streams SET status = 'ENDED', ended_at = NOW(), last_updated_at = NOW() WHERE id = $1`,
      [streamId]
    );
  }
}
