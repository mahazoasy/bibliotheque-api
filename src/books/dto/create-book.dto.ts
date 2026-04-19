import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty()
  @IsMongoId()
  author_id: string;
}