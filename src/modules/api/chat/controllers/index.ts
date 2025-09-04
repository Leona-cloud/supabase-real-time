import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatService } from '../services';

@Controller({
  path: 'chats',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('direct')
  async createDirectChat(@Body() body: { userA: number; userB: number }) {
    return await this.chatService.createDirectChat(body.userA, body.userB);
  }

  @Post('group')
  async createGroup(
    @Body() body: { ownerId: number; name: string; memberIds: number[] },
  ) {
    return await this.chatService.createGroupChat(
      body.ownerId,
      body.name,
      body.memberIds,
    );
  }

  @Post(':id/member')
  async addMemberToGroup(
    @Param('id') id: string,
    @Body() body: { adminId: number; userId: number },
  ) {
    return await this.chatService.addMember(
      Number(id),
      body.adminId,
      body.userId,
    );
  }

  @Delete(':id/member')
  async removeMember(
    @Param('id') id: string,
    @Body() body: { adminId: number; userId: number },
  ) {
    return await this.chatService.removeMember(
      Number(id),
      body.adminId,
      body.userId,
    );
  }

  @Get('user/:userId')
async getUserChats(@Param('userId') userId: string) {
  return this.chatService.getUserChats(Number(userId));
}


}
