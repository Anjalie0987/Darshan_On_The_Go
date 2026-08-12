import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { DbClient } from '../common/repository.interfaces';

export interface UserFavorite {
  user_id: string;
  temple_id: string;
  created_at: Date;
}

@Injectable()
export class FavoritesRepository {
  constructor(private readonly db: DatabaseService) {}

  protected getClient(client?: DbClient): DbClient {
    return client || this.db;
  }

  async addFavorite(userId: string, templeId: string, client?: DbClient): Promise<UserFavorite> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `INSERT INTO user_favorites (user_id, temple_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
      [userId, templeId]
    );
    return result.rows[0];
  }

  async removeFavorite(userId: string, templeId: string, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `DELETE FROM user_favorites WHERE user_id = $1 AND temple_id = $2`,
      [userId, templeId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async hasFavorite(userId: string, templeId: string, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT 1 FROM user_favorites WHERE user_id = $1 AND temple_id = $2 LIMIT 1`,
      [userId, templeId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async getUserFavorites(userId: string, client?: DbClient): Promise<any[]> {
    const runner = this.getClient(client);
    const query = `
      SELECT 
        t.id, t.name, t.slug, t.is_live,
        c.name as city, s.name as state, tc.name as category,
        (SELECT url FROM temple_images WHERE temple_id = t.id AND is_primary = true LIMIT 1) as image_url,
        uf.created_at as favorited_at
      FROM user_favorites uf
      JOIN temples t ON uf.temple_id = t.id
      LEFT JOIN states s ON t.state_id = s.id
      LEFT JOIN cities c ON t.city_id = c.id
      LEFT JOIN temple_categories tc ON t.category_id = tc.id
      WHERE uf.user_id = $1 AND t.status = 'PUBLISHED' AND t.is_active = true AND t.deleted_at IS NULL
      ORDER BY uf.created_at DESC
    `;
    const result = await runner.query(query, [userId]);
    return result.rows;
  }
}
