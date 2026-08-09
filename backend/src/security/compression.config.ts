import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// if default export is not available, we use require:
const compressionMiddleware = require('compression');

export function configureCompression(app: INestApplication, configService: ConfigService) {
  const isEnabled = configService.get<boolean>('COMPRESSION_ENABLED') ?? true;
  
  if (isEnabled) {
    app.use(compressionMiddleware());
  }
}
