import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

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

    // Passport module - provides authentication framework
    PassportModule.register({
      defaultStrategy: 'jwt', // Use JWT strategy by default
    }),

    // JWT module - provide JwtService for generating and verifying tokens
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRATION') ??
            '7d') as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule], // Export AuthService so other modules can use it
})
export class AuthModule {}
