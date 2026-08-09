import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface DeviceInfo {
  deviceName?: string;
  browser?: string;
  os?: string;
  userAgent?: string;
  lastActiveTimestamp?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  device_info: string | null; // JSON string
  ip_address: string | null;
  expires_at: Date;
  created_at: Date;
}

@Injectable()
export class UserSessionsRepository extends BaseRepository<UserSession> {
  constructor(db: DatabaseService) {
    super(db, 'user_sessions');
  }

  async findSessionByTokenHash(hash: string, client?: DbClient): Promise<UserSession | null> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `SELECT * FROM user_sessions WHERE refresh_token_hash = $1`,
      [hash],
    );
    return result.rows[0] || null;
  }

  async getUserSessions(userId: string, client?: DbClient): Promise<UserSession[]> {
    const runner = this.getClient(client);
    // Return all sessions for user, ordering by most recently created
    const result = await runner.query(
      `SELECT * FROM user_sessions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async revokeSession(userId: string, sessionId: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `DELETE FROM user_sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, userId],
    );
  }

  async revokeAllSessions(userId: string, excludeSessionId?: string, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    if (excludeSessionId) {
      await runner.query(
        `DELETE FROM user_sessions WHERE user_id = $1 AND id != $2`,
        [userId, excludeSessionId],
      );
    } else {
      await runner.query(
        `DELETE FROM user_sessions WHERE user_id = $1`,
        [userId],
      );
    }
  }

  // Override create to handle the specifics (e.g. no deleted_at)
  async createSession(data: Omit<UserSession, 'id' | 'created_at'>, client?: DbClient): Promise<UserSession> {
    return this.create(data, client);
  }

  // Clean up expired sessions periodically (optional usage)
  async deleteExpiredSessions(client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(`DELETE FROM user_sessions WHERE expires_at < NOW()`);
  }
}
