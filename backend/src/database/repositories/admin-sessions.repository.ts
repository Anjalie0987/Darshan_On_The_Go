import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface AdminSession {
  id: string;
  admin_id: string;
  refresh_token_hash: string;
  device_info: string | null; // JSON string
  ip_address: string | null;
  expires_at: Date;
  created_at: Date;
}

@Injectable()
export class AdminSessionsRepository extends BaseRepository<AdminSession> {
  constructor(db: DatabaseService) {
    super(db, 'admin_sessions');
  }

  async findSessionByTokenHash(hash: string, client?: DbClient): Promise<AdminSession | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM admin_sessions WHERE refresh_token_hash = $1`,
      [hash],
    );
    return result.rows[0] || null;
  }

  async getAdminSessions(adminId: string, client?: DbClient): Promise<AdminSession[]> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM admin_sessions WHERE admin_id = $1 ORDER BY created_at DESC`,
      [adminId],
    );
    return result.rows;
  }

  async revokeSession(adminId: string, sessionId: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `DELETE FROM admin_sessions WHERE id = $1 AND admin_id = $2`,
      [sessionId, adminId],
    );
  }

  async revokeAllSessions(adminId: string, excludeSessionId?: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    if (excludeSessionId) {
      await runner.query(
        `DELETE FROM admin_sessions WHERE admin_id = $1 AND id != $2`,
        [adminId, excludeSessionId],
      );
    } else {
      await runner.query(
        `DELETE FROM admin_sessions WHERE admin_id = $1`,
        [adminId],
      );
    }
  }

  async createSession(data: Omit<AdminSession, 'id' | 'created_at'>, client?: DbClient): Promise<AdminSession> {
    return this.create(data, client);
  }

  async deleteExpiredSessions(client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(`DELETE FROM admin_sessions WHERE expires_at < NOW()`);
  }
}
