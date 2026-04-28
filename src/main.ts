import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as fs from 'fs';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Bibliothèque')
    .setDescription('API REST de gestion de bibliothèque — Cours 2026')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  let document = SwaggerModule.createDocument(app, config);
  
  // Enrichissement manuel des schémas Swagger pour les endpoints
  document = {
    ...document,
    components: {
      ...document.components,
      schemas: {
        ...document.components?.schemas,
        SummaryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                book_id: { type: 'string' },
                title: { type: 'string' },
                summary: { type: 'string' },
                generated_by: { type: 'string' },
                generated_at: { type: 'string', format: 'date-time' },
              },
            },
            message: { type: 'string' },
          },
        },
        PaymentIntentResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                client_secret: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string' },
                publishable_key: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };
  
  // Génération des fichiers OpenAPI après enrichissement
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  fs.writeFileSync('./openapi.yaml', YAML.stringify(document));
  
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(3000);
}
bootstrap();