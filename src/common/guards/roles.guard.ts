import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants';
import { ROLES_KEY } from '../decorators';

/**
 * Roles Authorization Guard
 *
 * Checks if the authenticated user has the required role(s) to access a route.
 * This guard runs AFTER JwtAuthGuard (which authenticates the user).
 *
 * Flow:
 * 1. JwtAuthGuard authenticates user and attaches to request.user
 * 2. RolesGuard checks if route has @Roles() decorator
 * 3. If no @Roles(): Allow access (route doesn't require specific role)
 * 4. If @Roles(ADMIN): Check if user.role === 'ADMIN'
 * 5. If match: Allow access
 * 6. If no match: Deny access (403 Forbidden)
 *
 * IMPORTANT: This guard must be used AFTER JwtAuthGuard
 * because it needs request.user to be populated
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if user has required role(s) to access the route
   *
   * @param context - Execution context containing request and metadata
   * @returns true if user has required role, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator metadata
    // Check both method-level and class-level decorators
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if no @Roles() decorator, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract the user from the request object
    const { user } = context.switchToHttp().getRequest();

    // Security check: Ensure user object exists
    // This shouldn't happen if JwtAuthGuard ran first, but defensive programming
    if (!user || !user.role) {
      return false;
    }

    // Check if user's role is in the list of required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
