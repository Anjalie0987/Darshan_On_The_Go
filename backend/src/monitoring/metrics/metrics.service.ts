import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../logging/logger.service';

@Injectable()
export class MetricsService {
  private requestCount = 0;
  private errorCount = 0;
  private activeConnections = 0;

  constructor(private readonly logger: CustomLoggerService) {}

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  incrementActiveConnections() {
    this.activeConnections++;
  }

  decrementActiveConnections() {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
  }

  getMetrics() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      activeConnections: this.activeConnections,
    };
  }

  logMetricsPeriodic() {
    this.logger.log(`Metrics: ${JSON.stringify(this.getMetrics())}`, 'MetricsService');
  }
}
