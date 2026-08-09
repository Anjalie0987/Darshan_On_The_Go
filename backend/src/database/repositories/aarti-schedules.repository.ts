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
}
