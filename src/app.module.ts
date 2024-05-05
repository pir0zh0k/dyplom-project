import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccesTokenGuard } from './common/guards';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccesTokenGuard,
    },
  ],
})
export class AppModule {}
