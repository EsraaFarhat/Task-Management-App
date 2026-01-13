import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * JWT Strategy
 *
 * Implements Passport JWT authentication strategy.
 * This strategy is used by JwtAuthGuard to validate JWT tokens.
 *
 * Flow:
 * 1. Client sends request with Authorization header: "Bearer <token>"
 * 2. JwtAuthGuard extracts the token
 * 3. This strategy validates the token
 * 4. If valid, attaches user to request.user
 * 5. If invalid, throws UnauthorizedException
 *
 * How it works:
 * - PassportStrategy automatically extracts JWT from Authorization header
 * - Verifies signature using JWT_SECRET
 * - Calls validate() method with decoded payload
 * - validate() loads user from database and returns it
 * - Returned user is attached to request.user
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ignore expiration is false - expired tokens will be rejected
      ignoreExpiration: false,
      // Use secret from environment variables for verifying JWT signature
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate JWT Payload
   *
   * Called automatically by Passport after JWT signature is verified.
   * This is where we load the user from the database.
   *
   * Flow:
   * 1. JWT signature verified (done automatically)
   * 2. Payload decoded (done automatically)
   * 3. This method called with payload
   * 4. Load user from database using payload.sub (user ID)
   * 5. Return user (will be attached to request.user)
   *
   * @param payload - Decoded JWT payload
   * @returns User object (attached to request.user)
   * @throws UnauthorizedException if user not found or inactive
   */
  async validate(payload: JwtPayload): Promise<User> {
    // Extract user ID from payload
    const { sub: userId } = payload;

    // Load user from database
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check if user exists and is active
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Return user - will be attached to request.user
    // The @Exclude() decorator on User entity ensures sensitive fields like password are not included
    return user;
  }
}
