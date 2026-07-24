import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, type?: string, projectId?: string) {
    const q = query.toLowerCase();

    const results = {
      requirements: [],
      features: [],
      tasks: [],
      codeBlocks: [],
    };

    const projectFilter = projectId ? { projectId } : {};

    if (!type || type === 'requirements') {
      results.requirements = await this.prisma.requirement.findMany({
        where: {
          ...projectFilter,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
    }

    if (!type || type === 'features') {
      results.features = await this.prisma.feature.findMany({
        where: {
          ...projectFilter,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
    }

    if (!type || type === 'tasks') {
      results.tasks = await this.prisma.task.findMany({
        where: {
          ...projectFilter,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
    }

    if (!type || type === 'code') {
      results.codeBlocks = await this.prisma.codeBlock.findMany({
        where: {
          ...projectFilter,
          content: { contains: query, mode: 'insensitive' },
        },
        take: 10,
      });
    }

    return results;
  }

  async searchProject(projectId: string, query: string) {
    return this.search(query, undefined, projectId);
  }
}
