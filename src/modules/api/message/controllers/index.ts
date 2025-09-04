import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from '../services';
import { CreateMessageDto } from '../dtos';

@Controller({
  path: 'messages',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return await this.messageService.createMessage(dto);
  }

//   @Get(':chatId')
//   async getMessages(@Param('chatId') chatId: string) {
//     return await this.messageService.getMessages(Number(chatId));
//   }

  @Get(':chatId/user/:userId')
  async getMessages(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.messageService.getChatMessages(Number(userId), Number(chatId));
  }
}
