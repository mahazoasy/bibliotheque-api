import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from '../../books/schemas/book.schema';

export type BorrowDocument = Borrow & Document;

@Schema({ timestamps: true })
export class Borrow {
  @Prop({ required: true })
  user_name: string;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book_id: Types.ObjectId;

  @Prop({ default: Date.now })
  borrowed_at: Date;

  @Prop({ type: Date, default: null })  
  returned_at: Date | null;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);