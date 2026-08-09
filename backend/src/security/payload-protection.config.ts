import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

export function configurePayloadProtection(app: INestApplication, configService: ConfigService) {
  const jsonLimit = configService.get<string>('BODY_LIMIT_JSON') || '2mb';
  const urlEncodedLimit = configService.get<string>('BODY_LIMIT_URLENCODED') || '2mb';
  
  app.use(json({ limit: jsonLimit }));
  app.use(urlencoded({ extended: true, limit: urlEncodedLimit }));
}
