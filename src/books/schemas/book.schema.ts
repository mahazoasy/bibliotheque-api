import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Author } from '../../authors/schemas/author.schema';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  isbn: string;

  @Prop({ required: true })
  year: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author_id: Types.ObjectId;

  @Prop({ type: String, default: null })
  summary: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);