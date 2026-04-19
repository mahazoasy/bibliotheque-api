import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty()
  @IsMongoId()
  book_id: string;
}