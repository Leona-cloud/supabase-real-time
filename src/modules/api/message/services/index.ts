import { PrismaService } from '@/modules/core/prisma/services';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from '../dtos';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(options: CreateMessageDto) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: options.chatId },
      include: { members: true },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isMember = chat.members.some((m) => m.userId === options.userId);
    if (!isMember) throw new NotFoundException('User not part of this chat');

    await this.prisma.message.create({
      data: {
        identifier: `msg_${Date.now()}`,
        content: options.content,
        userId: options.userId,
        chatId: options.chatId,
      },
      include: { user: true, chat: true },
    });

    return { message: 'Message sent successfully' };
  }

  async getMessages(chatId: number) {
    return await this.prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });
  }

  async getChatMessages(userId: number, chatId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { members: true },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const isMember = chat.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('User not part of this chat');

    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });
  }
}
