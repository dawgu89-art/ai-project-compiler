import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ParsingModule } from './modules/parsing/parsing.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { SearchModule } from './modules/search/search.module';
import { ExportModule } from './modules/export/export.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ProjectsModule,
    ConversationsModule,
    ParsingModule,
    KnowledgeModule,
    SearchModule,
    ExportModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
