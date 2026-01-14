import { Expose } from 'class-transformer';
import { UserRole } from '../../../common/constants';

/**
 * User Response DTO
 *
 * Defines the structure of user data returned by the API.
 * Excludes sensitive fields like password.
 *
 */

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: UserRole;

  @Expose()
  isActive: boolean;

  @Expose()
  avatarUrl?: string;

  @Expose()
  updatedAt: Date;
}
