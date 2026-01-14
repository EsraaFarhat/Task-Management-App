import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { UserRole } from '../../../common/constants';

/**
 * Query Users DTO
 *
 * Defines query parameters for filtering and paginating users.
 * Used in GET /users endpoint.
 *
 */
export class QueryUsersDto {
  /**
   * Filter by role
   *
   */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /**
   * Filter by active status
   *
   */
  @IsOptional()
  @Type(() => String)
  @IsString()
  isActive?: string; // Will be 'true' or 'false' string from query param

  /**
   * Search by name or email
   *
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Page number (1-indexed)
   *
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Items per page
   *
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
