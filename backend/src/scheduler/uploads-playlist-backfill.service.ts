import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';
import { lastValueFrom } from 'rxjs';

/**
 * UploadsPlaylistBackfillService
 *
 * Runs ONCE at application startup.
 * Finds all temples that have a youtube_channel_id but NULL uploads_playlist_id,
 * then calls channels.list (contentDetails) to retrieve and store the uploads playlist ID.
 *
 * Safe to run multiple times — it only updates temples where uploads_playlist_id IS NULL.
 * Uses real YouTube API data only. Never creates fake data.
 */
@Injectable()
export class UploadsPlaylistBackfillService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UploadsPlaylistBackfillService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://youtube.googleapis.com/youtube/v3';

  constructor(
    private readonly db: DatabaseService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY') || '';
  }

  async onApplicationBootstrap() {
    await this.backfillUploadsPlaylistIds();
  }

  async backfillUploadsPlaylistIds(): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn('YOUTUBE_API_KEY not configured — skipping uploads_playlist_id backfill.');
      return;
    }

    let templesToBackfill: Array<{ id: string; youtube_channel_id: string }>;

    try {
      const result = await this.db.query(
        `SELECT id, youtube_channel_id
           FROM temples
          WHERE youtube_channel_id IS NOT NULL
            AND uploads_playlist_id IS NULL
            AND deleted_at IS NULL`,
      );
      templesToBackfill = result.rows;
    } catch (err: any) {
      this.logger.error(`Backfill: failed to query temples — ${err.message}`);
      return;
    }

    if (templesToBackfill.length === 0) {
      this.logger.log('Backfill: all temples already have uploads_playlist_id. Nothing to do.');
      return;
    }

    this.logger.log(`Backfill: ${templesToBackfill.length} temple(s) need uploads_playlist_id.`);

    let successCount = 0;
    let failCount = 0;

    for (const temple of templesToBackfill) {
      try {
        const params = {
          part: 'contentDetails',
          id: temple.youtube_channel_id,
          key: this.apiKey,
        };

        const response = await lastValueFrom(
          this.httpService.get(`${this.baseUrl}/channels`, { params }),
        );

        const items = response.data?.items;
        if (!items || items.length === 0) {
          this.logger.warn(
            `Backfill: No YouTube channel found for temple ${temple.id} (channelId: ${temple.youtube_channel_id}). Skipping.`,
          );
          failCount++;
          continue;
        }

        const uploadsPlaylistId = items[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsPlaylistId) {
          this.logger.warn(
            `Backfill: YouTube returned no uploads playlist for temple ${temple.id}. Skipping.`,
          );
          failCount++;
          continue;
        }

        await this.db.query(
          `UPDATE temples
              SET uploads_playlist_id = $1
            WHERE id = $2
              AND uploads_playlist_id IS NULL`,
          [uploadsPlaylistId, temple.id],
        );

        this.logger.log(
          `Backfill: temple ${temple.id} → uploads_playlist_id = ${uploadsPlaylistId}`,
        );
        successCount++;

        // Small delay to avoid burst quota usage during startup
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 403) {
          this.logger.error(
            `Backfill: YouTube quota exceeded (403) while processing temple ${temple.id}. Stopping backfill early.`,
          );
          break; // Stop immediately — don't hammer a quota-limited API
        }
        this.logger.error(
          `Backfill: Failed to backfill temple ${temple.id} — ${err.message}`,
        );
        failCount++;
      }
    }

    this.logger.log(
      `Backfill complete. Success: ${successCount}, Failed/Skipped: ${failCount}.`,
    );
  }
}
