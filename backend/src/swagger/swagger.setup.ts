import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication, configService: ConfigService) {
  const isEnabled = configService.get<boolean>('SWAGGER_ENABLED') ?? true;
  
  if (!isEnabled) {
    return;
  }

  const path = configService.get<string>('SWAGGER_PATH') || 'docs';
  const title = configService.get<string>('SWAGGER_TITLE') || 'DarshanHub API';
  const description = configService.get<string>('SWAGGER_DESCRIPTION') || 'API documentation';
  const version = configService.get<string>('SWAGGER_VERSION') || '1.0';
  const port = configService.get<number>('PORT') || 3001;

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addServer(`http://localhost:${port}`, 'Local Development')
    // Define future authentication
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Endpoints related to user authentication')
    .addTag('Users', 'Endpoints for user management')
    .addTag('Temples', 'Endpoints for temple directory and metadata')
    .addTag('Live Streams', 'Endpoints for active live streams')
    .addTag('YouTube', 'Endpoints integrating with YouTube Data API')
    .addTag('Admin', 'Administrative operations')
    .addTag('Health', 'System health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
    },
  });
}
