import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { BorrowsModule } from './borrows/borrows.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AuthorsModule,
    BooksModule,
    BorrowsModule,
  ],
})
export class AppModule {}