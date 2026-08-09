import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface TempleImage {
  id: string;
  temple_id: string;
  url: string;
  image_type: 'THUMBNAIL' | 'BANNER' | 'GALLERY';
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  storage_provider: string | null;
  is_primary: boolean;
}

@Injectable()
export class TempleImagesRepository extends BaseRepository<TempleImage> {
  constructor(db: DatabaseService) {
    super(db, 'temple_images');
  }

  async findByTempleId(templeId: string, client?: DbClient): Promise<TempleImage[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temple_images WHERE temple_id = $1 ORDER BY display_order ASC`,
      [templeId],
    );
    return result.rows;
  }
}
