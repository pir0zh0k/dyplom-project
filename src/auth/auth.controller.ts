import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { AuthDto } from './dto';
import { Request, Response } from 'express';
import { AdminGuard, RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AdminGuard)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
    const tokens = await this.authService.login(dto);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
    });

    return tokens;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    const tokens = await this.authService.refresh(
      user['sub'],
      user['refreshToken'],
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
    });

    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUser('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token');
    return this.authService.logout(userId);
  }
}
