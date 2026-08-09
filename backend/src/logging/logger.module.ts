import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Request } from 'express';
import { CustomLoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const pretty = configService.get<boolean>('LOG_PRETTY') ?? !isProduction;
        const level = configService.get<string>('LOG_LEVEL') || 'info';
        const enableRequestLogging = configService.get<boolean>('ENABLE_REQUEST_LOGGING') ?? true;

        return {
          pinoHttp: {
            level,
            autoLogging: enableRequestLogging,
            genReqId: (req: Request) => (req as any).id || req.headers['x-request-id'],
            transport: pretty
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
            // Strip sensitive headers
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
              censor: '***',
            },
          },
        };
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService, PinoLoggerModule],
})
export class AppLoggerModule {}
