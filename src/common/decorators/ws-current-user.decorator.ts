import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export const WsCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization.split(" ")[1];
    const jwt = new JwtService();

    const verified = jwt.verify(token, {
      secret: `${process.env.ACCESS_SECRET}`,
    });

    return verified[data];
  },
);
