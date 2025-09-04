import { PrismaService } from '@/modules/core/prisma/services';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createDirectChat(userA: number, userB: number) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        isGroup: false,
        members: {
          some: { userId: userA },
        },
        AND: {
          members: {
            some: { userId: userB },
          },
        },
      },
      include: { members: { include: { user: true } } },
    });

    if (existingChat) return existingChat;

    return await this.prisma.chat.create({
      data: {
        identifier: `chat_${Date.now()}`,
        isGroup: false,
        members: {
          create: [
            {
              userId: userA,
              role: 'member',
            },
            {
              userId: userB,
              role: 'member',
            },
          ],
        },
      },
      include: { members: { include: { user: true } } },
    });
  }

  async createGroupChat(ownerId: number, name: string, memberIds: number[]) {
    return this.prisma.chat.create({
      data: {
        identifier: `chat_${Date.now}`,
        isGroup: true,
        name: name,
        members: {
          create: [
            { userId: ownerId, role: 'admin' },
            ...memberIds.map((id) => ({ userId: id, role: 'member' })),
          ],
        },
      },
      include: { members: { include: { user: true } } },
    });
  }

  async addMember(chatId: number, adminId: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: { members: true },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.isGroup)
      throw new ForbiddenException('Cannot add members to a direct chat');

    const isAdmin = chat.members.some(
      (m) => m.userId === adminId && m.role === 'admin',
    );
    if (!isAdmin) {
      throw new ForbiddenException('Only Admins can add members to this chat');
    }

    return this.prisma.chatMember.create({
      data: { chatId, userId, role: 'member' },
      include: { user: true },
    });
  }

  async removeMember(chatId: number, adminId: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: { members: true },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!chat.isGroup)
      throw new ForbiddenException('Cannot remove members from a direct chat');

    const isAdmin = chat.members.some(
      (m) => m.userId === adminId && m.role === 'admin',
    );
    if (!isAdmin) {
      throw new ForbiddenException(
        'Only Admins can remove a member from this chat',
      );
    }

    return await this.prisma.chatMember.deleteMany({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });
  }

  async getUserChats(userId: number) {
    const chats = await this.prisma.chat.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { user: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return chats.map((chat) => ({
      id: chat.id,
      identifier: chat.identifier,
      name: chat.isGroup
        ? chat.name
        : chat.members.find((m) => m.userId !== userId)?.user.firstName,
      isGroup: chat.isGroup,
      lastMessage: chat.messages[0]
        ? {
            content: chat.messages[0].content,
            sender: chat.messages[0].user.firstName,
            createdAt: chat.messages[0].createdAt,
          }
        : null,
      members: chat.members.map((m) => ({
        id: m.user.id,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        role: m.role,
      })),
    }));
  }
}
