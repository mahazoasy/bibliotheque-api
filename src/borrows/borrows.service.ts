import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Borrow, BorrowDocument } from './schemas/borrow.schema';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Book, BookDocument } from '../books/schemas/book.schema';

@Injectable()
export class BorrowsService {
  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBorrowDto: CreateBorrowDto): Promise<Borrow> {
    const book = await this.bookModel.findById(createBorrowDto.book_id);
    if (!book) throw new BadRequestException('Livre non trouvé');
    if (!book.available) throw new BadRequestException('Ce livre n\'est pas disponible');
    const borrow = new this.borrowModel({
      ...createBorrowDto,
      borrowed_at: new Date(),
      returned_at: null,
    });
    await this.bookModel.findByIdAndUpdate(createBorrowDto.book_id, { available: false });
    return borrow.save();
  }

  async findAllActive(): Promise<Borrow[]> {
    return this.borrowModel.find({ returned_at: null }).populate('book_id').exec();
  }

  async returnBook(id: string): Promise<Borrow> {
    const borrow = await this.borrowModel.findById(id);
    if (!borrow) throw new NotFoundException('Emprunt non trouvé');
    if (borrow.returned_at !== null) throw new BadRequestException('Ce livre a déjà été rendu');
    borrow.returned_at = new Date();
    await borrow.save();
    await this.bookModel.findByIdAndUpdate(borrow.book_id, { available: true });
    return borrow;
  }
}