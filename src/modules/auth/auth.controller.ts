import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Auth Controller
 *
 * Handles authentication HTTP endpoints:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login existing user
 *
 * Both endpoints are public (no authentication required)
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register endpoint
   *
   * POST /api/auth/register
   *
   * Request body:
   * {
   *   "email": "john@example.com",
   *   "password": "MyPassword123!",
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "role": "MEMBER"
   * }
   *
   * Response:
   * {
   *   "statusCode": 201,
   *   "message": "Success",
   *   "data": {
   *     "accessToken": "eyJ...",
   *     "user": { ... }
   *   }
   * }
   *
   * @param registerDto - Registration data
   * @returns Auth response with token and user
   */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login endpoint
   *
   * POST /api/auth/login
   *
   * Request body:
   * {
   *   "email": "john@example.com",
   *   "password": "MyPassword123!"
   * }
   *
   * Response:
   * {
   *   "statusCode": 200,
   *   "message": "Success",
   *   "data": {
   *     "accessToken": "eyJ...",
   *     "user": { ... }
   *   }
   * }
   *
   * @param loginDto - Login credentials
   * @returns Auth response with token and user
   */
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
