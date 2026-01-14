import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/constants';
import { QueryUsersDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

/**
 * Users Service
 *
 * Handles user management business logic:
 * - List users (with filtering and pagination)
 * - Get user by ID
 * - Update user
 * - Delete user
 * - Get current user profile
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all users with filtering and pagination
   *
   * @param queryDto - Query parameters (role, search, page, limit)
   * @param currentUser - User making the request (for authorization)
   * @returns Paginated list of users
   */
  async findAll(queryDto: QueryUsersDto) {
    const { role, isActive, search, page = 1, limit = 10 } = queryDto;

    // Search by name or email (case-insensitive)
    let queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder = queryBuilder.where(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Apply other filters
    if (role) {
      queryBuilder = queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder = queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: isActive === 'true',
      });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder = queryBuilder.skip(skip).take(limit);

    // Execute query
    const [users, total] = await queryBuilder.getManyAndCount();

    // Return paginated result
    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   *
   * @param id - User ID
   * @returns User entity
   * @throws NotFoundException if user not found
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Update user
   *
   * @param id - User ID to update
   * @param updateUserDto - Fields to update
   * @param currentUser - User making the request (for authorization)
   * @returns Updated user
   * @throws NotFoundException if user not found
   * @throws ForbiddenException if user lacks permission
   * @throws ConflictException if email already exists
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    // Find user to update
    const user = await this.findOne(id);

    // Authorization checks
    const isOwnProfile = currentUser.id === id;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    // Non-admins can only update their own profile
    if (!isOwnProfile && !isAdmin) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Only admins can change role or isActive
    if (
      !isAdmin &&
      (updateUserDto.role || updateUserDto.isActive !== undefined)
    ) {
      throw new ForbiddenException(
        'Only admins can change roles or account status',
      );
    }

    // Check email uniqueness if email is being changed
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update user
    Object.assign(user, updateUserDto);

    // Save (password will be hashed by @BeforeUpdate hook if changed)
    return this.userRepository.save(user);
  }

  /**
   * Delete user
   *
   * @param id - User ID to delete
   * @param currentUser - User making the request (for authorization)
   * @throws NotFoundException if user not found
   * @throws ForbiddenException if user lacks permission or tries to delete self
   */
  async remove(id: string, currentUser: User): Promise<void> {
    // Only admins can delete users
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    // Can't delete yourself
    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // Find user
    const user = await this.findOne(id);

    // Delete user (cascades to tasks, comments, notifications)
    await this.userRepository.remove(user);
  }

  /**
   * Get current user profile
   *
   * @param currentUser - Authenticated user from JWT
   * @returns Current user entity
   */
  async getProfile(currentUser: User): Promise<User> {
    // Return user from JWT (already loaded by JwtStrategy)
    return currentUser;
  }
}
