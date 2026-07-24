import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';

@ApiTags('knowledge')
@Controller('projects/:projectId/knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get('requirements')
  @ApiOperation({ summary: 'Get all requirements for a project' })
  getRequirements(@Param('projectId') projectId: string) {
    return this.knowledgeService.getRequirements(projectId);
  }

  @Get('features')
  @ApiOperation({ summary: 'Get all features for a project' })
  getFeatures(@Param('projectId') projectId: string) {
    return this.knowledgeService.getFeatures(projectId);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks for a project' })
  getTasks(@Param('projectId') projectId: string) {
    return this.knowledgeService.getTasks(projectId);
  }

  @Get('architecture')
  @ApiOperation({ summary: 'Get architecture for a project' })
  getArchitecture(@Param('projectId') projectId: string) {
    return this.knowledgeService.getArchitecture(projectId);
  }

  @Get('code-blocks')
  @ApiOperation({ summary: 'Get all code blocks for a project' })
  getCodeBlocks(@Param('projectId') projectId: string) {
    return this.knowledgeService.getCodeBlocks(projectId);
  }
}
