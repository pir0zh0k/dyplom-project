import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccesTokenGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccesTokenGuard)
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }
}
