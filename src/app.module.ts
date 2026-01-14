import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

/**
 * Root Application Module
 *
 * This is the entry point of the NestJS application.
 * It imports all feature modules and configures global services.
 *
 */

@Module({
  imports: [
    // ConfigModule - Loads environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the app without importing
      envFilePath: '.env', // Specify the path to the .env file
    }),

    // TypeOrmModule - Configures database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access ConfigService
      inject: [ConfigService], // Inject ConfigService into the factory function
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService), // Use our config factory
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor,
    },
    /**
     * JWT Authentication Guard
     *
     * Protects all routes by default.
     * Routes marked with @Public() decorator are exempt.
     *
     */
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    /**
     * Roles Authorization Guard
     *
     * Checks if user has required role(s) to access route.
     * Routes marked with @Roles() decorator are checked.
     * Routes without @Roles() allow any authenticated user.
     *
     **/
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
