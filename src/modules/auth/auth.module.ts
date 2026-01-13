import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Auth Module
 *
 * Encapsulates all authentication-related functionality.
 *
 * Design Pattern: Module Pattern
 * - Groups related components together
 * - Provides clear boundaries
 * - Makes the application modular and maintainable
 */

@Module({
  imports: [
    // Import User repository for database access
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export AuthService so other modules can use it
})
export class AuthModule {}
