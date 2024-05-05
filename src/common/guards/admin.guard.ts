import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { email } = request.user;
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user.role === 'ADMIN') return true;

    return false;
  }
}
