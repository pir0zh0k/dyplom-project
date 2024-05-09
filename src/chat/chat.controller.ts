import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto';
import { GetCurrentUser } from 'src/common/decorators';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async create(
    @Body() dto: CreateChatDto,
    @GetCurrentUser('sub') creatorId: string,
  ) {
    return await this.chatService.create(creatorId, dto);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return this.chatService.delete(id);
  }

  @Get('getChat/:id')
  async getChat(@Param('id') id: string) {
    return await this.chatService.getChat(id);
  }
}
