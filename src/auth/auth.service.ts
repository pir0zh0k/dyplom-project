import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException();

    const passwordMatched = await compare(dto.password, user.passwordHash);
    if (!passwordMatched) throw new ForbiddenException();

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  async refresh(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Доступ запрещен');

    const refreshMatches = await compare(refreshToken, user.refreshTokenHash);
    if (!refreshMatches) throw new ForbiddenException('Доступ запрещен');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /**TODO:
   * - Helper functions
   */
  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: hashedRefreshToken,
      },
    });
  }

  async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email: email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '120s',
      secret: process.env.ACCESS_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3h',
      secret: process.env.REFRESH_SECRET,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
