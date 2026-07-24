import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { ParsingService } from '../parsing/parsing.service';
import { ExportService } from '../export/export.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private conversationsService: ConversationsService,
    private parsingService: ParsingService,
    private exportService: ExportService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        conversations: {
          select: {
            id: true,
            format: true,
            status: true,
            importedAt: true,
          },
        },
        requirements: true,
        features: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        conversations: true,
        requirements: true,
        features: true,
        tasks: true,
        architecture: true,
        codeBlocks: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async importConversation(projectId: string, file: Express.Multer.File) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    return this.conversationsService.importConversation(projectId, file);
  }

  async parseProject(projectId: string) {
    const project = await this.findOne(projectId);
    const conversations = await this.prisma.conversation.findMany({
      where: { projectId },
      orderBy: { importedAt: 'asc' },
    });

    if (conversations.length === 0) {
      throw new BadRequestException('No conversations to parse');
    }

    const parsed = await this.parsingService.parseConversations(conversations, project);

    return {
      projectId,
      status: 'completed',
      parsed,
    };
  }

  async exportProject(id: string) {
    const project = await this.findOne(id);
    return this.exportService.generateExport(project);
  }
}
