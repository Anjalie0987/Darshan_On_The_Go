import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface TempleCategory {
  id: number;
  parent_category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

@Injectable()
export class TempleCategoriesRepository extends BaseRepository<TempleCategory> {
  constructor(db: DatabaseService) {
    super(db, 'temple_categories');
  }

  async findAllActive(client?: DbClient): Promise<TempleCategory[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temple_categories WHERE is_active = true ORDER BY display_order ASC`
    );
    return result.rows;
  }
  
  async findBySlug(slug: string, client?: DbClient): Promise<TempleCategory | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM temple_categories WHERE slug = $1`,
      [slug],
    );
    return result.rows[0] || null;
  }
}
