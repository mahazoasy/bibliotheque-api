import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorsService } from './authors/authors.service';
import { BooksService } from './books/books.service';
import { BorrowsService } from './borrows/borrows.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authorsService = app.get(AuthorsService);
  const booksService = app.get(BooksService);
  const borrowsService = app.get(BorrowsService);
  const usersService = app.get(UsersService);

  // 1. Créer un utilisateur admin (nécessaire pour les emprunts, car Borrow a user_id)
  let adminUser;
  try {
    adminUser = await usersService.findOneByUsername('admin');
  } catch {
    adminUser = await usersService.create({
      username: 'admin',
      password: 'password123',
      name: 'Administrateur',
      subscription_status: 'free',
    });
  }
  console.log(`Utilisateur admin ID: ${adminUser._id}`);

  // 2. Créer 3 auteurs
  const author1 = await authorsService.create({
    first_name: 'rabearivelo',
    last_name: 'Jean Joseph',
    nationality: 'Malagasy',
  });
  const author2 = await authorsService.create({
    first_name: 'Samuel',
    last_name: 'Ratany',
    nationality: 'Malagasy',
  });
  const author3 = await authorsService.create({
    first_name: 'Andriamanantena',
    last_name: 'Georges',
    nationality: 'Malagasy',
  });
  console.log('Auteurs créés');

  // 3. Créer 5 livres (avec author_id)
  const book1 = await booksService.create({
    title: 'Volume',
    isbn: '978-0451525260',
    year: 1935,
    author_id: author1._id.toString(),
    available: true,
  });
  const book2 = await booksService.create({
    title: 'Izay ho feoko eo am-pialana aina',
    isbn: '978-0451524935',
    year: 1924,
    author_id: author2._id.toString(),
    available: true,
  });
  const book3 = await booksService.create({
    title: 'Orgueil et Préjugés',
    isbn: '978-0141439518',
    year: 1813,
    author_id: author3._id.toString(),
    available: true,
  });
  const book4 = await booksService.create({
    title: 'Dinitra',
    isbn: '978-0451526342',
    year: 1973,
    author_id: author2._id.toString(),
    available: true,
  });
  const book5 = await booksService.create({
    title: 'Ando',
    isbn: '978-2070366477',
    year: 1969,
    author_id: author1._id.toString(),
    available: true,
  });
  console.log('Livres créés');

  // 4. Créer 2 emprunts (avec user_id)
  await borrowsService.create(
    { user_name: 'Judicaël', book_id: book1._id.toString() },
    adminUser._id.toString(),
  );
  await borrowsService.create(
    { user_name: 'Mahazoasy', book_id: book2._id.toString() },
    adminUser._id.toString(),
  );
  console.log('Emprunts créés');

  await app.close();
  console.log('Seed terminé !');
}
bootstrap();