import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across all projects' })
  search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.searchService.search(query, type, projectId);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Search within a specific project' })
  searchProject(
    @Param('projectId') projectId: string,
    @Query('q') query: string,
  ) {
    return this.searchService.searchProject(projectId, query);
  }
}
