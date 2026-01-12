import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants';

/**
 * Roles Decorator
 *
 * Marks a route with required roles for authorization.
 * Used in combination with RolesGuard to protect routes.
 *
 */

// Metadata key used to store roles
export const ROLES_KEY = 'roles';

/**
 * @Roles decorator function
 * @param roles - One or more UserRole values that can access this route
 * @returns Decorator that attaches roles metadata to the route handler
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
