import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation details' })
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete conversation' })
  delete(@Param('id') id: string) {
    return this.conversationsService.delete(id);
  }
}
