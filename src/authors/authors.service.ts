import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './schemas/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Book, BookDocument } from '../books/schemas/book.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const newAuthor = new this.authorModel(createAuthorDto);
    return newAuthor.save();
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel.find().exec();
  }

  async findOne(id: string): Promise<Author & { books: Book[] }> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) throw new NotFoundException('Auteur non trouvé');
    const books = await this.bookModel.find({ author_id: id }).exec();
    return { ...author.toObject(), books };
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const updated = await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Auteur non trouvé');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.authorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Auteur non trouvé');
  }
}