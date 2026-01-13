import { config } from 'dotenv';
import { DataSource } from 'typeorm';

/**
 * TypeORM CLI Configuration
 *
 * This file is used by TypeORM CLI commands for migrations.
 * Separate from the NestJS configuration in database.config.ts
 *
 */

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'task_management_db',

  // Entity locations
  entities: ['src/**/*.entity{.ts,.js}'],

  // Migration settings
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',

  // Logging
  logging: true,

  // Never use synchronize in production
  synchronize: false,
});
