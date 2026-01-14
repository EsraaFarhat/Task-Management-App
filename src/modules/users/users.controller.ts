import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserRole } from '../../common/constants';
import { GetUser, Roles } from '../../common/decorators';
import { QueryUsersDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * Users Controller
 *
 * Handles HTTP endpoints for user management.
 * All routes require authentication (no @Public() decorator).
 *
 * Routes:
 * - GET    /api/users/me          - Get current user profile
 * - GET    /api/users             - List all users (admin only)
 * - GET    /api/users/:id         - Get user by ID
 * - PATCH  /api/users/:id         - Update user
 * - DELETE /api/users/:id         - Delete user (admin only)
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   *
   * GET /api/users/me
   *
   * Returns the authenticated user's profile.
   * Any authenticated user can access this.
   *
   */
  @Get('me')
  getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user);
  }

  /**
   * List all users
   *
   * GET /api/users?role=ADMIN&page=1&limit=10
   *
   * Returns paginated list of users with optional filtering.
   * Only admins can access this.
   *
   * Query parameters:
   * - role: Filter by role (ADMIN, MANAGER, MEMBER)
   * - isActive: Filter by status (true, false)
   * - search: Search in first name or last name or email
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   *
   */
  @Roles(UserRole.ADMIN) // Only admins can list all users
  @Get()
  findAll(@Query() queryDto: QueryUsersDto) {
    return this.usersService.findAll(queryDto);
  }

  /**
   * Get user by ID
   *
   * GET /api/users/:id
   *
   * Returns user details by ID.
   * Any authenticated user can access this.
   * TODO: Validate id is provided and is a valid UUID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update user
   *
   * PATCH /api/users/:id
   *
   * Updates user fields.
   *
   * Authorization:
   * - Users can update their own profile (name, email, password, avatar)
   * - Only admins can update other users
   * - Only admins can change role or isActive
   *
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  /**
   * Delete user
   *
   * DELETE /api/users/:id
   *
   * Permanently deletes a user.
   * Only admins can delete users.
   * Users cannot delete themselves.
   *
   * Cascades:
   * - Deletes user's created tasks
   * - Unassigns user from assigned tasks
   * - Deletes user's comments
   * - Deletes user's notifications
   *
   */
  @Roles(UserRole.ADMIN) // Only admins can delete users
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.usersService.remove(id, user);
    return null; // Return null for successful deletion
  }
}
