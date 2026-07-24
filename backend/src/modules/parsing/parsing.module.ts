import { Module } from '@nestjs/common';
import { ParsingService } from './parsing.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [ParsingService],
  exports: [ParsingService],
})
export class ParsingModule {}
