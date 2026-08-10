import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface AartiSchedule {
  id: string;
  temple_id: string;
  name: string;
  time_start: string;
  time_end: string | null;
  time_zone: string;
  day_of_week: number | null;
  display_order: number;
  notes: string | null;
}

@Injectable()
export class AartiSchedulesRepository extends BaseRepository<AartiSchedule> {
  constructor(db: DatabaseService) {
    super(db, 'aarti_schedules');
  }

  async findByTempleId(templeId: string, client?: DbClient): Promise<AartiSchedule[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM aarti_schedules WHERE temple_id = $1 ORDER BY display_order ASC, time_start ASC`,
      [templeId],
    );
    return result.rows;
  }

  async findTodaysAartis(dayOfWeek: number, client?: DbClient): Promise<any[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT 
         a.*,
         t.name as temple_name,
         t.slug as temple_slug,
         c.name as temple_city,
         s.name as temple_state,
         (SELECT url FROM temple_images WHERE temple_id = t.id AND is_primary = true LIMIT 1) as "temple_image_url"
       FROM aarti_schedules a
       JOIN temples t ON a.temple_id = t.id
       LEFT JOIN cities c ON t.city_id = c.id
       LEFT JOIN states s ON t.state_id = s.id
       WHERE t.is_active = true 
         AND t.status = 'PUBLISHED'
         AND t.deleted_at IS NULL
         AND (a.day_of_week IS NULL OR a.day_of_week = $1)
       ORDER BY a.time_start ASC`,
      [dayOfWeek]
    );
    return result.rows;
  }
}
