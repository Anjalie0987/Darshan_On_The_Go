import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly threshold: number;

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.threshold = this.configService.get<number>('LOG_SLOW_REQUEST_THRESHOLD') || 2000;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isEnabled = this.configService.get<boolean>('ENABLE_PERFORMANCE_LOGGING') ?? true;
    
    if (!isEnabled) {
      return next.handle();
    }

    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const reqId = (request as any).id;

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - now;
        
        if (executionTime > this.threshold) {
          this.logger.warn(
            `Slow Request [${reqId}]: ${method} ${url} took ${executionTime}ms (Threshold: ${this.threshold}ms)`,
            'PerformanceInterceptor'
          );
        }
      }),
    );
  }
}
