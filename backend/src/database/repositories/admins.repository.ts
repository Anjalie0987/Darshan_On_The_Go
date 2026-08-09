import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEMPLE_MANAGER' | 'CONTENT_MANAGER' | 'VIEWER';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

@Injectable()
export class AdminsRepository extends BaseRepository<Admin> {
  constructor(db: DatabaseService) {
    super(db, 'admins');
  }

  async findByEmail(email: string, client?: DbClient): Promise<Admin | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM admins WHERE email = $1 AND deleted_at IS NULL`,
      [email],
    );
    return result.rows[0] || null;
  }
}
