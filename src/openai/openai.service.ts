import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
    this.baseUrl = this.config.getOrThrow<string>('OPENAI_BASE_URL');
    this.model = this.config.getOrThrow<string>('OPENAI_MODEL');
  }

  async generateBookSummary(title: string, authorName: string, year: number): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'Tu es un expert en littérature. Génère un résumé concis et accrocheur en français, maximum 3 phrases.' },
            { role: 'user', content: `Génère un résumé pour le livre "${title}" écrit par ${authorName}, publié en ${year}.` },
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI error:', error.response?.data || error.message);
      throw new InternalServerErrorException('OpenAI service unavailable');
    }
  }

  async extractKeywords(query: string): Promise<string[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: 'Extrais les mots-clés importants de la requête. Retourne uniquement un tableau JSON. Exemple : ["mot1","mot2"]' },
            { role: 'user', content: query },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
        },
      );
      let keywords = JSON.parse(response.data.choices[0].message.content);
      if (!Array.isArray(keywords)) keywords = [];
      return keywords;
    } catch (error) {
      console.error('OpenAI keyword error:', error);
      return [];
    }
  }
}