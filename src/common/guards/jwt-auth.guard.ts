import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';

/**
 * JWT Authentication Guard
 *
 * Protects routes by requiring a valid JWT token.
 * This guard extends Passport's AuthGuard to add custom logic.
 *
 * Flow:
 * 1. Request comes in
 * 2. Guard checks if route has @Public() decorator
 * 3. If public: Allow access without authentication
 * 4. If not public: Validate JWT token via Passport JWT Strategy
 * 5. If valid: Attach user to request and allow access
 * 6. If invalid: Throw UnauthorizedException (401)
 *
 * Usage:
 * This will be applied globally in app.module.ts, so all routes
 * are protected by default unless marked with @Public()
 *
 * How Passport integration works:
 * - AuthGuard('jwt') calls the JWT strategy we'll create
 * - Strategy validates token and extracts payload
 * - If successful, user is attached to request.user
 * - If failed, throws UnauthorizedException
 */

@Injectable() // Makes this class a NestJS provider (can be injected)
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the request can proceed
   *
   * @param context - Execution context containing request metadata
   * @returns true if access allowed, false/throws exception otherwise
   */
  canActivate(context: ExecutionContext) {
    // Check if the route is marked as public using the reflector
    // Reflector reads metadata attached by decorators
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Method-level decorator (e.g., @Public() on a method)
      context.getClass(), // Class-level decorator (e.g., @Public() on a controller)
    ]);

    // If route is public, allow access without authentication
    if (isPublic) {
      return true;
    }

    // Otherwise, all parent class (Passport AuthGuard) to validate JWT
    // This will invoke the JWT strategy and validate the token
    return super.canActivate(context);
  }

  /**
   * Handles requests where authentication fails
   *
   * @param err - Error from authentication
   * @param user - User object (null if authentication failed)
   * @returns User object if authentication succeeded
   * @throws UnauthorizedException if authentication failed
   */
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }

    // Authentication succeeded, return the user object
    // This user will be attached to request.user
    return user;
  }
}
