import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Auth Service
 *
 * Handles authentication business logic:
 * - User registration
 * - User login
 * - JWT token generation
 */

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Register a new user
   *
   * Flow:
   * 1. Check if email already exists
   * 2. Create new user (password hashed automatically by User entity)
   * 3. Save to database
   * 4. Generate JWT token (next commit)
   * 5. Return token and user info
   *
   * @param registerDto - Registration data
   * @returns Auth response with token and user info
   * @throws ConflictException if email already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, role } = registerDto;
    // 1. Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Create new user
    const user = await this.userRepository.create({
      email,
      password, // Will be hashed by User entity before save
      firstName,
      lastName,
      role,
    });

    // 3. Save to database
    await this.userRepository.save(user);

    // TODO: Generate JWT token

    // 5. Return token and user info
    return {
      accessToken: 'TODO_GENERATE_TOKEN',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Login existing user
   *
   * Flow:
   * 1. Find user by email
   * 2. Validate password
   * 3. Generate JWT token
   * 4. Return token and user info
   *
   * @param loginDto - Login credentials
   * @returns Auth response with token and user info
   * @throws UnauthorizedException if credentials are invalid
   */

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    // 1. Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //  Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // TODO: Generate JWT token
    // 4. Return token and user info
    return {
      accessToken: 'TODO_GENERATE_TOKEN',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
