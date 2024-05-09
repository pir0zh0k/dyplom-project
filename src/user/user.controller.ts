import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccesTokenGuard, AdminGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }
}
