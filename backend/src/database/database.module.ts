import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { DatabaseService } from './database.service';
import { DatabaseHealthService } from './database.health';
import { DATABASE_CONFIG } from './database.constants';
import { DatabaseEnvironmentVariables } from './database.config';
import { DatabaseModuleOptions } from './database.interfaces';

// Repositories
import { UsersRepository } from './repositories/users.repository';
import { AdminsRepository } from './repositories/admins.repository';
import { TemplesRepository } from './repositories/temples.repository';
import { TempleCategoriesRepository } from './repositories/temple-categories.repository';
import { TempleImagesRepository } from './repositories/temple-images.repository';
import { TempleSocialLinksRepository } from './repositories/temple-social-links.repository';
import { AartiSchedulesRepository } from './repositories/aarti-schedules.repository';
import { EventsRepository } from './repositories/events.repository';
import { StreamingProvidersRepository } from './repositories/streaming-providers.repository';
import { TempleStreamingChannelsRepository } from './repositories/temple-streaming-channels.repository';
import { LiveStreamsRepository } from './repositories/live-streams.repository';
import { NotificationsRepository } from './repositories/notifications.repository';
import { FavoritesRepository } from './repositories/favorites.repository';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { AuditLogsRepository } from './repositories/audit-logs.repository';
import { GlobalSettingsRepository } from './repositories/global-settings.repository';
import { UserSessionsRepository } from './repositories/user-sessions.repository';
import { AdminSessionsRepository } from './repositories/admin-sessions.repository';

const REPOSITORIES = [
  UsersRepository,
  AdminsRepository,
  TemplesRepository,
  TempleCategoriesRepository,
  TempleImagesRepository,
  TempleSocialLinksRepository,
  AartiSchedulesRepository,
  EventsRepository,
  StreamingProvidersRepository,
  TempleStreamingChannelsRepository,
  LiveStreamsRepository,
  NotificationsRepository,
  FavoritesRepository,
  AnalyticsRepository,
  AuditLogsRepository,
  GlobalSettingsRepository,
  UserSessionsRepository,
  AdminSessionsRepository,
];

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options?: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: options?.global ?? true,
      imports: [ConfigModule],
      providers: [
        {
          provide: DATABASE_CONFIG,
          useFactory: () => {
            const validatedConfig = plainToInstance(
              DatabaseEnvironmentVariables,
              process.env,
              { enableImplicitConversion: true },
            );
            
            const errors = validateSync(validatedConfig, {
              skipMissingProperties: false,
            });
            
            if (errors.length > 0) {
              const errorMessage = errors
                .map((err) => Object.values(err.constraints || {}).join(', '))
                .join('; ');
              throw new Error(`Database configuration validation failed: ${errorMessage}`);
            }
            
            return validatedConfig;
          },
        },
        DatabaseService,
        DatabaseHealthService,
        ...REPOSITORIES,
      ],
      exports: [DatabaseService, DatabaseHealthService, ...REPOSITORIES],
    };
  }
}
