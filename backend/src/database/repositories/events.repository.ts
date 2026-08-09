import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface Event {
  id: string;
  temple_id: string;
  name: string;
  description: string | null;
  event_type: 'FESTIVAL' | 'RITUAL';
  start_date: Date;
  end_date: Date | null;
  banner_image: string | null;
  registration_required: boolean;
  livestream_enabled: boolean;
  is_featured: boolean;
}

@Injectable()
export class EventsRepository extends BaseRepository<Event> {
  constructor(db: DatabaseService) {
    super(db, 'events');
  }

  async findUpcomingByTempleId(templeId: string, client?: DbClient): Promise<Event[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM events WHERE temple_id = $1 AND start_date >= NOW() ORDER BY start_date ASC`,
      [templeId],
    );
    return result.rows;
  }
}
