import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

export function configureHelmet(app: INestApplication, configService: ConfigService) {
  const isEnabled = configService.get<boolean>('HELMET_ENABLED') ?? true;
  
  if (isEnabled) {
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        // Modify these settings based on frontend/swagger requirements later
      })
    );
  }
}
