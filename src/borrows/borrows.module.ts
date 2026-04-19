import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';
import { Borrow, BorrowSchema } from './schemas/borrow.schema';
import { Book, BookSchema } from '../books/schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Borrow.name, schema: BorrowSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}