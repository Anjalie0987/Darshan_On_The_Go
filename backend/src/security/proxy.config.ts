import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

export function configureProxy(app: INestApplication, configService: ConfigService) {
  const trustProxy = configService.get<boolean>('TRUST_PROXY') ?? false;
  
  // We need to cast it to NestExpressApplication to access underlying express instance methods
  const expressApp = app as NestExpressApplication;
  
  if (trustProxy && expressApp.set) {
    expressApp.set('trust proxy', 1);
  }
}
