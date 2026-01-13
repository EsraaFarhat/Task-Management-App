import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/constants';

/**
 * Register DTO (Data Transfer Object)
 *
 * Defines the structure and validation rules for user registration.
 * Uses class-validator decorators for automatic validation.
 *
 * Validation happens automatically via ValidationPipe (configured in main.ts)
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  /**
   * Note: In production, Restrict who can create ADMIN accounts
   * For now, anyone can register as any role (for testing)
   */
  @IsEnum(UserRole, { message: 'Role must be one of: ADMIN, MANAGER, MEMBER' })
  role?: UserRole;
}
