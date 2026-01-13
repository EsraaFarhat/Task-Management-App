import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserRole } from './common/constants';
import { Public, Roles } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  getProtected(): string {
    return 'This route is protected!';
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdminOnly(): string {
    return 'This route is for admins only!';
  }
}
