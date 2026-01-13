import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';

/**
 * Application Bootstrap
 *
 * This is the entry point that starts the NestJS application.
 * It configures global pipes, CORS, and starts the HTTP server.
 */

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: true, //! In production, specify exact origins like ['http://localhost:3000']
    credentials: true, // Allow credentials like cookies to be shared
  });

  // Global validation pipe
  // Automatically validate incoming requests based on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types (e.g., '123' to 123)
      },
    }),
  );

  /**
   * Class Serializer Interceptor
   *
   * Excludes fields marked with @Exclude() from responses.
   *
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new HttpExceptionFilter());

  // Get port from environment variables or default to 3000
  const port = configService.get<number>('PORT') || 3000;

  // Start the HTTP server
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
