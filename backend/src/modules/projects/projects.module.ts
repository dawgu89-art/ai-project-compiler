import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { ParsingModule } from '../parsing/parsing.module';
import { ExportModule } from '../export/export.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    PrismaModule,
    ConversationsModule,
    ParsingModule,
    ExportModule,
    SearchModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
