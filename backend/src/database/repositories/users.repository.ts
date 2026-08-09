import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(db: DatabaseService) {
    super(db, 'users');
  }

  async findByEmail(email: string, client?: DbClient): Promise<User | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email],
    );
    return result.rows[0] || null;
  }

  async getProfile(userId: string, client?: DbClient): Promise<any> {
    const runner = this.getClient(client);
    const query = `
      SELECT 
        u.id, 
        u.email, 
        u.first_name, 
        u.last_name, 
        u.created_at,
        (SELECT COUNT(*) FROM user_favorites WHERE user_id = u.id) as favorites_count
      FROM users u
      WHERE u.id = $1 AND u.deleted_at IS NULL
    `;
    const result = await runner.query(query, [userId]);
    return result.rows[0] || null;
  }
}
