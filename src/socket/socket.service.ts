import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { PrismaService } from "src/prisma/prisma.service";
import { SocketDto } from "./dto/socket.dto";
import { UseGuards } from "@nestjs/common";
import { AccesTokenGuard, SocketGuard } from "src/common/guards";
import { WsCurrentUser } from "src/common/decorators";

@WebSocketGateway({
  cors: {
    origin: "",
  },
})
export class SocketService implements OnGatewayConnection {
  constructor(private prisma: PrismaService) {}

  @UseGuards(SocketGuard)
  @SubscribeMessage("message")
  async getMessage(
    @MessageBody() dto: SocketDto,
    @ConnectedSocket() client: any,
    @WsCurrentUser("sub") senderId: string,
  ) {
    const response = await this.prisma.message.create({
      data: {
        text: dto.text,
        chatId: dto.chatId,
        userId: senderId,
      },
    });

    client.emit("updateMessage", response);
  }

  @UseGuards(AccesTokenGuard)
  handleConnection() {
    console.log("Connected");
  }
}
