# API Bibliothèque - NestJS + MongoDB

## Installation
1. Cloner le dépôt
2. `npm install`
3. Créer un fichier `.env` (voir `.env.example`)
4. Démarrer MongoDB localement (ou utiliser MongoDB Atlas)
5. `npm run start:dev`

## Endpoints
Base URL: `http://localhost:3000/api/v1`

Documentation Swagger: `http://localhost:3000/api/documentation`

## Seeders (données initiales)
Pour remplir la base avec des données de test (3 auteurs, 5 livres, 2 emprunts) :
> **Prérequis** : installez `ts-node` en dépendance de développement avec `npm install -D ts-node`

1. Créez un fichier `seed.ts` dans `src/seed.ts` (exemple ci-dessous)
2. Exécutez-le avec `npx ts-node src/seed.ts`

**Exemple de script `src/seed.ts`** :
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorsService } from './authors/authors.service';
import { BooksService } from './books/books.service';
import { BorrowsService } from './borrows/borrows.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authorsService = app.get(AuthorsService);
  const booksService = app.get(BooksService);
  const borrowsService = app.get(BorrowsService);

  // Créer 3 auteurs
  const author1 = await authorsService.create({ first_name: 'rabearivelo', last_name: 'Jean Joseph', nationality: 'Malagasy' });
  const author2 = await authorsService.create({ first_name: 'Samuel', last_name: 'Ratany', nationality: 'Malagasy' });
  const author3 = await authorsService.create({ first_name: 'Andriamanantena', last_name: 'Georges', nationality: 'Malagasy' });

  // Créer 5 livres
  const book1 = await booksService.create({ title: 'Volume', isbn: '978-0451525260', year: 1935, author_id: author1._id });
  const book2 = await booksService.create({ title: 'Izay ho feoko eo am-pialana aina', isbn: '978-0451524935', year: 1924, author_id: author2._id });
  const book3 = await booksService.create({ title: 'Orgueil et Préjugés', isbn: '978-0141439518', year: 1813, author_id: author3._id });
  const book4 = await booksService.create({ title: 'Dinitra', isbn: '978-0451526342', year: 1973, author_id: author2._id });
  const book5 = await booksService.create({ title: 'Ando', isbn: '978-2070366477', year: 1969, author_id: author1._id });

  // Créer 2 emprunts
  await borrowsService.create({ user_name: 'Judicaël', book_id: book1._id });
  await borrowsService.create({ user_name: 'Mahazoasy', book_id: book2._id });

  console.log('Seed terminé !');
  await app.close();
}
bootstrap();