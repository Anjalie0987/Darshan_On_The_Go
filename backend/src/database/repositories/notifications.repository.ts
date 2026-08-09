import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { BaseRepository } from './base.repository';
import { DbClient } from '../common/repository.interfaces';

export interface Notification {
  id: string;
  type: string;
  temple_id: string | null;
  title: string;
  body: string;
  created_at: Date;
}

export interface UserNotification {
  id: string;
  notification_id: string;
  user_id: string;
  channel_id: string | null;
  delivery_status: 'PENDING' | 'SENT' | 'FAILED';
  read_at: Date | null;
}

@Injectable()
export class NotificationsRepository extends BaseRepository<Notification> {
  constructor(db: DatabaseService) {
    super(db, 'notifications');
  }

  async createUserNotification(
    data: Partial<UserNotification>, 
    client?: DbClient
  ): Promise<UserNotification> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `INSERT INTO user_notifications (notification_id, user_id, channel_id, delivery_status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.notification_id, data.user_id, data.channel_id, data.delivery_status || 'PENDING']
    );
    return result.rows[0];
  }

  async markAsRead(userNotificationId: string, client?: DbClient): Promise<boolean> {
    const runner = this.getClient(client);
    const result = await runner.query(
      `UPDATE user_notifications SET read_at = NOW() WHERE id = $1`,
      [userNotificationId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
