import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const cookieParser = require('cookie-parser');

export function configureCookies(app: INestApplication, configService: ConfigService) {
  const secret = configService.get<string>('COOKIE_SECRET');
  
  app.use(cookieParser(secret));
}
