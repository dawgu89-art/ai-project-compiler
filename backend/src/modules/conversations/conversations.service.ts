import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async importConversation(projectId: string, file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const format = file.originalname.split('.').pop() || 'txt';

    const conversation = await this.prisma.conversation.create({
      data: {
        projectId,
        content,
        format,
        status: 'pending',
      },
    });

    return {
      conversationId: conversation.id,
      projectId,
      format,
      status: 'imported',
    };
  }

  async findOne(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }

    return conversation;
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  async getByProject(projectId: string) {
    return this.prisma.conversation.findMany({
      where: { projectId },
      orderBy: { importedAt: 'desc' },
    });
  }
}
