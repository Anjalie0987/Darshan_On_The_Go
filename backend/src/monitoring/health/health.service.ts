import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class HealthService {
  constructor(private readonly db: DatabaseService) {}

  async checkDatabase(): Promise<{ status: 'up' | 'down'; latency?: number; error?: string }> {
    const start = Date.now();
    try {
      await this.db.query('SELECT 1');
      return { status: 'up', latency: Date.now() - start };
    } catch (e: any) {
      return { status: 'down', error: e.message };
    }
  }

  getMemoryUsage() {
    const memory = process.memoryUsage();
    return {
      rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memory.external / 1024 / 1024)} MB`,
    };
  }

  getUptime(): number {
    return process.uptime();
  }
}
