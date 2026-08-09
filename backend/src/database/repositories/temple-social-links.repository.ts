import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface TempleSocialLink {
  id: string;
  temple_id: string;
  platform: string;
  url: string;
}

@Injectable()
export class TempleSocialLinksRepository extends BaseRepository<TempleSocialLink> {
  constructor(db: DatabaseService) {
    super(db, 'temple_social_links');
  }

  async findByTempleId(templeId: string, client?: DbClient): Promise<TempleSocialLink[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temple_social_links WHERE temple_id = $1`,
      [templeId],
    );
    return result.rows;
  }
}
