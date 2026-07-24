import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  async getRequirements(projectId: string) {
    await this.validateProject(projectId);
    return this.prisma.requirement.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeatures(projectId: string) {
    await this.validateProject(projectId);
    return this.prisma.feature.findMany({
      where: { projectId },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTasks(projectId: string) {
    await this.validateProject(projectId);
    return this.prisma.task.findMany({
      where: { projectId },
      include: { feature: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getArchitecture(projectId: string) {
    await this.validateProject(projectId);
    return this.prisma.architecture.findUnique({
      where: { projectId },
    });
  }

  async getCodeBlocks(projectId: string) {
    await this.validateProject(projectId);
    return this.prisma.codeBlock.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async validateProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
  }
}
