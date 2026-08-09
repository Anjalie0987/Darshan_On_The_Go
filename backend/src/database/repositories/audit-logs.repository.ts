import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { DbClient } from '../common/repository.interfaces';

export interface AuditLog {
  request_id: string | null;
  performed_by: string | null;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity_name: string;
  entity_id: string;
  old_data: any;
  new_data: any;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
}

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly db: DatabaseService) {}

  protected getClient(client?: DbClient): DbClient {
    return client || this.db;
  }

  async createLog(log: AuditLog, client?: DbClient): Promise<void> {
    const runner = this.getClient(client);
    await runner.query(
      `INSERT INTO audit_logs 
       (request_id, performed_by, action_type, entity_name, entity_id, old_data, new_data, metadata, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        log.request_id, log.performed_by, log.action_type, log.entity_name, log.entity_id, 
        JSON.stringify(log.old_data), JSON.stringify(log.new_data), JSON.stringify(log.metadata), 
        log.ip_address, log.user_agent
      ]
    );
  }
}
