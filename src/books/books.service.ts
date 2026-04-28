import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author, AuthorDocument } from '../authors/schemas/author.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const authorExists = await this.authorModel.findById(createBookDto.author_id);
    if (!authorExists) throw new BadRequestException("L'auteur spécifié n'existe pas");
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  async getAuthorByBookId(bookId: string): Promise<Author> {
    const book = await this.bookModel.findById(bookId)
      .populate<{ author_id: Author }>('author_id')
      .exec();
    if (!book) throw new NotFoundException('Livre non trouvé');
    if (!book.author_id) throw new NotFoundException('Auteur non trouvé');
    return book.author_id;
  }

  async updateSummary(id: string, summary: string): Promise<Book> {
    const updated = await this.bookModel.findByIdAndUpdate(
      id,
      { summary },
      { returnDocument: 'after' }
    ).exec();
    if (!updated) throw new NotFoundException('Livre non trouvé');
    return updated;
  }

  async searchByKeywords(keywords: string[]): Promise<Book[]> {
    const regexs = keywords.map(k => new RegExp(k, 'i'));
    return this.bookModel.aggregate([
      {
        $lookup: {
          from: 'authors',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $match: {
          $or: [
            { title: { $in: regexs } },
            { 'author.first_name': { $in: regexs } },
            { 'author.last_name': { $in: regexs } },
          ],
        },
      },
    ]).exec();
  }

  async findAll(available?: boolean): Promise<Book[]> {
    const filter = available !== undefined ? { available } : {};
    return this.bookModel.find(filter).populate('author_id').exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('author_id').exec();
    if (!book) throw new NotFoundException('Livre non trouvé');
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    if (updateBookDto.author_id) {
      const authorExists = await this.authorModel.findById(updateBookDto.author_id);
      if (!authorExists) throw new BadRequestException("L'auteur spécifié n'existe pas");
    }
    const updated = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).populate('author_id').exec();
    if (!updated) throw new NotFoundException('Livre non trouvé');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Livre non trouvé');
  }
}