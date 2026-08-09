import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

// Common Infrastructure
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CustomLoggerService } from './logging/logger.service';

// Modular Security Configurations
import { configureHelmet } from './security/helmet.config';
import { configureCors } from './security/cors.config';
import { configureCompression } from './security/compression.config';
import { configureCookies } from './security/cookies.config';
import { configureProxy } from './security/proxy.config';
import { configurePayloadProtection } from './security/payload-protection.config';

// API Documentation
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  
  // Serve static files from uploads folder
  const express = require('express');
  const path = require('path');
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Set Pino as the global logger
  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  
  const customLogger = app.get(CustomLoggerService);

  const port = configService.get<number>('PORT') || 3001;
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';

  // 1. Proxy Configuration
  configureProxy(app, configService);

  // 2. Security Middleware
  configureHelmet(app, configService);
  configureCors(app, configService);
  configurePayloadProtection(app, configService);
  configureCompression(app, configService);
  configureCookies(app, configService);

  // 3. Global Prefix & Versioning
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 4. Graceful Shutdown Hooks
  app.enableShutdownHooks();

  // 5. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 6. Global Interceptors & Filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(customLogger));

  // 7. API Documentation (Swagger)
  setupSwagger(app, configService);

  await app.listen(port);
  customLogger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
