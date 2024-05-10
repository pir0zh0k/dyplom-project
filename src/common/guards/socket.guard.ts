import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(" ")[1];

    try {
      const isMatched = this.jwtService.verify(token, {
        secret: `${process.env.ACCESS_SECRET}`,
      });

      if (isMatched.sub) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
