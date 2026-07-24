import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ParsingService {
  private readonly techPatterns = {
    languages: {
      TypeScript: /\b(typescript|tsx?|@types)\b/i,
      Python: /\b(python|py|pip|requirements\.txt)\b/i,
      JavaScript: /\b(javascript|jsx?|node|npm|yarn)\b/i,
      SQL: /\b(sql|postgres|mysql|sqlite|schema)\b/i,
      Java: /\b(java|maven|gradle)\b/i,
      Go: /\b(golang|go mod)\b/i,
      Rust: /\b(rust|cargo|rs)\b/i,
      PHP: /\b(php|laravel|symfony)\b/i,
      Ruby: /\b(ruby|rails|erb)\b/i,
    },
    frameworks: {
      React: /\b(react|jsx|hooks|redux)\b/i,
      Vue: /\b(vue\.js|vuex|template)\b/i,
      Angular: /\b(angular|typescript|module)\b/i,
      NextJS: /\b(next\.js|next|ssr)\b/i,
      Django: /\b(django|management|models\.py)\b/i,
      FastAPI: /\b(fastapi|starlette|pydantic)\b/i,
      Express: /\b(express|middleware|route)\b/i,
      NestJS: /\b(nestjs|@nestjs|module|controller)\b/i,
      Laravel: /\b(laravel|eloquent|blade)\b/i,
    },
    databases: {
      PostgreSQL: /\b(postgres|postgresql|psql)\b/i,
      MySQL: /\b(mysql|mariadb)\b/i,
      MongoDB: /\b(mongodb|mongoose|bson)\b/i,
      SQLite: /\b(sqlite|sqlite3)\b/i,
      Redis: /\b(redis|cache|session)\b/i,
      Elasticsearch: /\b(elasticsearch|lucene)\b/i,
      Cassandra: /\b(cassandra|cql)\b/i,
    },
  };

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async parseConversations(conversations: any[], project: any) {
    const results = [];

    for (const conversation of conversations) {
      const parsed = await this.parseConversation(conversation, project);
      results.push(parsed);
    }

    return results;
  }

  private async parseConversation(conversation: any, project: any) {
    // Stage 1: Normalize
    const normalized = this.normalize(conversation.content);

    // Stage 2: Detect code blocks
    const codeBlocks = this.detectCodeBlocks(normalized);

    // Stage 3: Detect documentation
    const docs = this.detectDocumentation(normalized);

    // Stage 4: Extract requirements
    const requirements = await this.extractRequirements(normalized);

    // Stage 5: Extract features
    const features = await this.extractFeatures(normalized);

    // Stage 6: Detect architecture
    const architecture = await this.detectArchitecture(normalized, codeBlocks);

    // Stage 7: Detect tech stack
    const techStack = this.detectTechStack(codeBlocks, normalized);

    // Stage 8: Extract tasks
    const tasks = this.extractTasks(normalized);

    // Save extracted knowledge
    await this.saveExtractedKnowledge(project.id, {
      requirements,
      features,
      architecture,
      tasks,
      codeBlocks,
      techStack,
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        parsedAt: new Date(),
        status: 'parsed',
        extractedCode: JSON.stringify(codeBlocks),
        extractedDocs: JSON.stringify(docs),
        codeBlockCount: codeBlocks.length,
      },
    });

    return {
      conversationId: conversation.id,
      codeBlocksExtracted: codeBlocks.length,
      requirementsFound: requirements.length,
      featuresFound: features.length,
      tasksFound: tasks.length,
      techStackDetected: techStack,
    };
  }

  private normalize(content: string): string {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private detectCodeBlocks(content: string): any[] {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        content: match[2].trim(),
        lines: match[2].trim().split('\n').length,
      });
    }

    return blocks;
  }

  private detectDocumentation(content: string): any[] {
    const docs = [];
    const lines = content.split('\n');

    let currentSection = null;
    for (const line of lines) {
      if (line.startsWith('#')) {
        currentSection = {
          type: 'heading',
          content: line.replace(/^#+\s/, ''),
          level: (line.match(/^#+/) || [''])[0].length,
        };
        docs.push(currentSection);
      }
    }

    return docs;
  }

  private async extractRequirements(content: string): Promise<any[]> {
    const requirementPatterns = [
      /requirement[s]?:?\s*(.+?)(?=\n|requirement|feature|$)/gi,
      /must\s+(.+?)(?=\n|must|should|$)/gi,
      /need[s]?\s+(.+?)(?=\n|need|want|$)/gi,
    ];

    const requirements = new Set();

    for (const pattern of requirementPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const req = match[1].trim();
        if (req.length > 5 && req.length < 500) {
          requirements.add(req);
        }
      }
    }

    return Array.from(requirements).map((title) => ({
      title: (title as string).substring(0, 200),
      description: '',
      priority: 'medium',
    }));
  }

  private async extractFeatures(content: string): Promise<any[]> {
    const featurePatterns = [
      /feature[s]?:?\s*(.+?)(?=\n|feature|requirement|$)/gi,
      /functionality:?\s*(.+?)(?=\n|functionality|feature|$)/gi,
      /implement[s]?\s+(.+?)(?=\n|implement|add|$)/gi,
    ];

    const features = new Set();

    for (const pattern of featurePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const feat = match[1].trim();
        if (feat.length > 5 && feat.length < 500) {
          features.add(feat);
        }
      }
    }

    return Array.from(features).map((name) => ({
      name: (name as string).substring(0, 200),
      description: '',
      status: 'planned',
    }));
  }

  private extractTasks(content: string): any[] {
    const taskPatterns = [
      /todo[s]?:?\s*(.+?)(?=\n|todo|fix|$)/gi,
      /(?:^|\n)\s*-\s+\[ ?\]\s*(.+?)(?=\n)/gi,
      /(?:^|\n)\s*- (?!\[)(.+?)(?=\n)/gi,
    ];

    const tasks = new Set();

    for (const pattern of taskPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const task = match[1].trim();
        if (task.length > 3 && task.length < 300) {
          tasks.add(task);
        }
      }
    }

    return Array.from(tasks).map((title) => ({
      title: (title as string).substring(0, 200),
      description: '',
      status: 'todo',
    }));
  }

  private async detectArchitecture(content: string, codeBlocks: any[]): Promise<any> {
    const architectureKeywords = [
      /architecture[s]?:?(.+?)(?=\n|feature|$/is,
      /design[s]?:?(.+?)(?=\n|feature|$/is,
      /system[s]?\s+design:?(.+?)(?=\n|feature|$/is,
    ];

    let architectureDescription = '';
    for (const pattern of architectureKeywords) {
      const match = pattern.exec(content);
      if (match) {
        architectureDescription = match[1].trim().substring(0, 1000);
        break;
      }
    }

    return {
      overview: architectureDescription || 'Not specified',
      components: JSON.stringify([]),
      layers: JSON.stringify([]),
    };
  }

  private detectTechStack(codeBlocks: any[], content: string): any {
    const stack = {
      languages: new Set(),
      frameworks: new Set(),
      databases: new Set(),
    };

    const fullText = content.toLowerCase();

    // Detect from code blocks
    for (const block of codeBlocks) {
      for (const [lang, pattern] of Object.entries(this.techPatterns.languages)) {
        if (pattern.test(block.language)) {
          stack.languages.add(lang);
        }
      }
    }

    // Detect from content
    for (const [lang, pattern] of Object.entries(this.techPatterns.languages)) {
      if (pattern.test(fullText)) {
        stack.languages.add(lang);
      }
    }

    for (const [fw, pattern] of Object.entries(this.techPatterns.frameworks)) {
      if (pattern.test(fullText)) {
        stack.frameworks.add(fw);
      }
    }

    for (const [db, pattern] of Object.entries(this.techPatterns.databases)) {
      if (pattern.test(fullText)) {
        stack.databases.add(db);
      }
    }

    return {
      languages: Array.from(stack.languages),
      frameworks: Array.from(stack.frameworks),
      databases: Array.from(stack.databases),
    };
  }

  private async saveExtractedKnowledge(projectId: string, knowledge: any) {
    // Save requirements
    for (const req of knowledge.requirements) {
      await this.prisma.requirement.create({
        data: {
          projectId,
          title: req.title,
          description: req.description,
          priority: req.priority,
        },
      });
    }

    // Save features
    for (const feature of knowledge.features) {
      await this.prisma.feature.create({
        data: {
          projectId,
          name: feature.name,
          description: feature.description,
          status: feature.status,
        },
      });
    }

    // Save tasks
    for (const task of knowledge.tasks) {
      await this.prisma.task.create({
        data: {
          projectId,
          title: task.title,
          description: task.description,
          status: task.status,
        },
      });
    }

    // Save code blocks
    for (const block of knowledge.codeBlocks) {
      await this.prisma.codeBlock.create({
        data: {
          projectId,
          language: block.language,
          content: block.content,
        },
      });
    }

    // Save or update architecture
    const existingArch = await this.prisma.architecture.findUnique({
      where: { projectId },
    });

    if (!existingArch) {
      await this.prisma.architecture.create({
        data: {
          projectId,
          overview: knowledge.architecture.overview,
          components: knowledge.architecture.components,
          layers: knowledge.architecture.layers,
        },
      });
    }

    // Update project tech stack
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        detectedLanguages: JSON.stringify(knowledge.techStack.languages),
        detectedFrameworks: JSON.stringify(knowledge.techStack.frameworks),
        detectedDatabases: JSON.stringify(knowledge.techStack.databases),
      },
    });
  }
}
