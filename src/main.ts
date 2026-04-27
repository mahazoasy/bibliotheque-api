import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import * as fs from 'fs';

async function bootstrap() {
  // Option rawBody: true est nécessaire pour Stripe Webhook
  const app = await NestFactory.create(AppModule, { rawBody: true });
  
  // Application des filtres et pipes
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Bibliothèque')
    .setDescription('API REST de gestion de bibliothèque — Cours 2026')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Enrichissement manuel des schémas Swagger pour les nouveaux endpoints
  document.components = {
    ...document.components,
    schemas: {
      ...document.components?.schemas,
      SummaryResponse: { /* ... */ },
      PaymentIntentResponse: { /* ... */ },
    },
  };
  
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(3000);
  // fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
}
bootstrap();