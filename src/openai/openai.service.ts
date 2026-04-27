import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('OPENAI_API_KEY');
    this.baseUrl = this.config.get('OPENAI_BASE_URL');
    this.model = this.config.get('OPENAI_MODEL');
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('OpenAI configuration missing');
    }
  }

  async generateBookSummary(title: string, authorName: string, year: number): Promise<string> {
    const systemPrompt = `Tu es un expert en littérature. Tu génères des résumés concis et accrocheurs pour des fiches de bibliothèque. Réponds toujours en français. Maximum 3 phrases.`;
    const userPrompt = `Génère un résumé pour le livre intitulé "${title}" écrit par ${authorName}, publié en ${year}.`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
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
    const systemPrompt = `Extrais les mots-clés importants de la requête de l'utilisateur. Retourne uniquement un tableau JSON de mots-clés. Exemple : ["mot1", "mot2"].`;
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      let keywords = JSON.parse(response.data.choices[0].message.content);
      if (!Array.isArray(keywords)) keywords = [];
      return keywords;
    } catch (error) {
      console.error('OpenAI keyword extraction error:', error);
      return [];
    }
  }
}