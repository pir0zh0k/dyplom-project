import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChat(id: string) {
    const chat = this.prisma.chat.findFirst({
      where: {
        id,
      },
    });

    return chat;
  }

  async create(creatorId: string, dto: CreateChatDto) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        id: dto.participantId,
      },
    });

    if (!candidate) throw new BadRequestException('Пользователь не найден');

    const chat = await this.prisma.chat.create({
      data: {
        users: {
          connect: [{ id: creatorId }, { id: dto.participantId }],
        },
      },
    });

    return chat;
  }

  async delete(id: string) {
    const searchChat = await this.prisma.chat.findUnique({
      where: {
        id: id,
      },
    });

    if (!searchChat) throw new BadRequestException();

    const deleted = await this.prisma.chat.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Deleted',
      ...deleted,
    };
  }
}
