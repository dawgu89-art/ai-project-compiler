import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }

  @Post(':id/import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import a conversation file' })
  importConversation(
    @Param('id') projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.importConversation(projectId, file);
  }

  @Post(':id/parse')
  @ApiOperation({ summary: 'Parse conversations and extract knowledge' })
  parse(@Param('id') id: string) {
    return this.projectsService.parseProject(id);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export project as ZIP' })
  async export(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.projectsService.exportProject(id);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="project-${id}.zip"`,
    });
    res.send(buffer);
  }
}
