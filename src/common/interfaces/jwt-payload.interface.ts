/**
 * JWT Payload Interface
 *
 * Defines the structure of data stored inside JWT tokens.
 * When a user logs in, we create a JWT token containing this information.
 *
 * The payload should contain:
 * - Minimum information needed to identify the user
 * - Information needed for authorization (role)
 * - Nothing sensitive (tokens can be decoded by anyone!)
 */

import { UserRole } from '../constants';

export interface JwtPayload {
  // User's unique identifier (UUID)
  sub: string;

  /**
   * User's email address
   * Used for displaying user info without additional database queries
   */
  email: string;

  /**
   * User's role for authorization
   * Used by RolesGuard to check permissions
   */
  role: UserRole;

  /**
   * Issued At - Timestamp when token was created (added automatically by JWT library)
   */
  iat?: number;

  /**
   * Expiration - Timestamp when token expires (added automatically by JWT library)
   */
  exp?: number;
}
