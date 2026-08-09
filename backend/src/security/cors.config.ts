import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureCors(app: INestApplication, configService: ConfigService) {
  const originsStr = configService.get<string>('CORS_ORIGINS') || '*';
  
  let origin: string | string[] | boolean = true;
  
  if (originsStr !== '*') {
    origin = originsStr.split(',').map((s) => s.trim());
  }

  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Required for cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Request-Id'],
  });
}
