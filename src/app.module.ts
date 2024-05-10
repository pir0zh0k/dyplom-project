import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AccesTokenGuard, SocketGuard } from "./common/guards";
import { ChatModule } from "./chat/chat.module";
import { SocketService } from "./socket/socket.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ChatModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccesTokenGuard,
    },
    SocketService,
    JwtService,
  ],
})
export class AppModule {}
