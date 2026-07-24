import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import axios from 'axios';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private provider: string;
  private ollamaUrl: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
    this.ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

    if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async chat(prompt: string): Promise<string> {
    if (this.provider === 'openai') {
      return this.chatWithOpenAI(prompt);
    } else if (this.provider === 'ollama') {
      return this.chatWithOllama(prompt);
    } else {
      throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  private async chatWithOpenAI(prompt: string): Promise<string> {
    try {
      const message = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return message.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI error:', error);
      return '';
    }
  }

  private async chatWithOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: process.env.OLLAMA_MODEL || 'neural-chat',
        prompt,
        stream: false,
      });

      return response.data.response || '';
    } catch (error) {
      console.error('Ollama error:', error);
      return '';
    }
  }
}
