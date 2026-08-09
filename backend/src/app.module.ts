import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppEnvironmentVariables } from './config/app.config';
import { SecurityEnvironmentVariables } from './config/security.config';
import { LoggingEnvironmentVariables } from './config/logging.config';
import { SwaggerEnvironmentVariables } from './config/swagger.config';
import { AuthEnvironmentVariables } from './config/auth.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TemplesModule } from './temples/temples.module';
import { LivestreamsModule } from './livestreams/livestreams.module';
import { YoutubeModule } from './youtube/youtube.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { FavoritesModule } from './favorites/favorites.module';

import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';

import { AppLoggerModule } from './logging/logger.module';
import { PerformanceInterceptor } from './logging/performance.logger';
import { MonitoringModule } from './monitoring/monitoring.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

export function validate(config: Record<string, unknown>) {
  const appConfig = plainToInstance(AppEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const appErrors = validateSync(appConfig, { skipMissingProperties: false });

  const securityConfig = plainToInstance(SecurityEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const securityErrors = validateSync(securityConfig, { skipMissingProperties: false });

  const loggingConfig = plainToInstance(LoggingEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const loggingErrors = validateSync(loggingConfig, { skipMissingProperties: false });

  const swaggerConfig = plainToInstance(SwaggerEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const swaggerErrors = validateSync(swaggerConfig, { skipMissingProperties: false });

  const authConfig = plainToInstance(AuthEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const authErrors = validateSync(authConfig, { skipMissingProperties: false });

  const errors = [...appErrors, ...securityErrors, ...loggingErrors, ...swaggerErrors, ...authErrors];

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return { ...appConfig, ...securityConfig, ...loggingConfig, ...swaggerConfig, ...authConfig };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('RATE_LIMIT_TTL') || 60000,
          limit: config.get<number>('RATE_LIMIT_MAX') || 100,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    AppLoggerModule,
    MonitoringModule,
    CommonModule,
    AuthModule,
    UsersModule,
    TemplesModule,
    LivestreamsModule,
    YoutubeModule,
    SchedulerModule,
    AdminModule,
    FavoritesModule,
    DatabaseModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Only RequestIdMiddleware is needed globally before request gets to pino-http
    consumer.apply(RequestIdMiddleware).forRoutes('(.*)');
  }
}
