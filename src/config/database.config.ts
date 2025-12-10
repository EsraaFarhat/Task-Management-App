import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database Configuration Factory
 *
 * This function creates the TypeORM configuration object using environment variables.
 * It's used by TypeORM to establish a connection to PostgreSQL.
 *
 * Design Pattern: Factory Pattern - creates configuration objects based on environment
 */

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Auto-load all entities
    synchronize: configService.get<string>('NODE_ENV') === 'development', // Auto-sync in development only
    logging: configService.get<string>('NODE_ENV') === 'development', // Log queries in development only
    autoLoadEntities: true, // Automatically load entities registered in modules
  };
};
