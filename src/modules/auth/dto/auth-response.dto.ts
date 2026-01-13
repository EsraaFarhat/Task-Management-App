import { UserRole } from '../../../common/constants';

/**
 * Auth Response DTO
 *
 * Defines the structure of the response after successful authentication.
 * Returned by both register and login endpoints.
 *
 * Contains:
 * - JWT access token
 * - User information (without sensitive data like password)
 */
export class AuthResponseDto {
  accessToken: string;

  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
  };
}
