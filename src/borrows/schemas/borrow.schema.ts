import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from '../../books/schemas/book.schema';

export type BorrowDocument = Borrow & Document;

@Schema({ timestamps: true })
export class Borrow {
  @Prop({ required: true })
  user_name: string;
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book_id: Types.ObjectId;

  @Prop({ default: Date.now })
  borrowed_at: Date;

  @Prop({ type: Date, default: null })  
  returned_at: Date | null;

  @Prop({ type: String, enum: ['pending', 'paid', 'free'], default: 'free' })
  payment_status: string;

}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);