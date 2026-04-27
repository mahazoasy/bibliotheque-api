import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';
import { Author, AuthorSchema } from '../authors/schemas/author.schema';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    OpenaiModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}