import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { OpenaiService } from '../openai/openai.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly openaiService: OpenaiService,
    private readonly config: ConfigService,
  ) {}

  // === Méthodes existantes ===
  @Get()
  @ApiOperation({ summary: 'Liste des livres (filtre par disponibilité)' })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Liste obtenue' })
  async findAll(@Query('available') available?: string) {
    const availableBool = available === 'true' ? true : (available === 'false' ? false : undefined);
    const data = await this.booksService.findAll(availableBool);
    return { success: true, data, message: 'Liste des livres' };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un livre' })
  @ApiResponse({ status: 201, description: 'Livre créé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 422, description: 'Validation échouée' })
  async create(@Body() createBookDto: CreateBookDto) {
    const data = await this.booksService.create(createBookDto);
    return { success: true, data, message: 'Livre créé avec succès' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un livre + auteur' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Détails obtenus' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  async findOne(@Param('id') id: string) {
    const data = await this.booksService.findOne(id);
    return { success: true, data, message: 'Détails du livre' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un livre' })
  @ApiResponse({ status: 200, description: 'Livre modifié' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const data = await this.booksService.update(id, updateBookDto);
    return { success: true, data, message: 'Livre modifié' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un livre' })
  @ApiResponse({ status: 204, description: 'Livre supprimé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  async remove(@Param('id') id: string) {
    await this.booksService.remove(id);
  }

  // === NOUVEAUX ENDPOINTS POUR OPENAI ===
  @Post(':id/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Génère et sauvegarde un résumé via OpenAI' })
  async generateSummary(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (book.summary) {
      return {
        success: true,
        data: {
          book_id: id,
          title: book.title,
          summary: book.summary,
          generated_by: 'cached',
          generated_at: book.updatedAt,
        },
        message: 'Résumé existant retourné (pas de nouvel appel API)',
      };
    }
    const author = await this.booksService.getAuthorByBookId(id);
    const summaryText = await this.openaiService.generateBookSummary(
      book.title,
      `${author.first_name} ${author.last_name}`,
      book.year,
    );
    const updatedBook = await this.booksService.updateSummary(id, summaryText);
    return {
      success: true,
      data: {
        book_id: id,
        title: updatedBook.title,
        summary: updatedBook.summary,
        generated_by: this.config.get('OPENAI_MODEL'),
        generated_at: updatedBook.updatedAt,
      },
    };
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Retourne le résumé existant du livre' })
  async getSummary(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book.summary) {
      throw new NotFoundException('Aucun résumé disponible pour ce livre');
    }
    return {
      success: true,
      data: { summary: book.summary },
    };
  }

  @Post('smart-search')
  @ApiOperation({ summary: 'Recherche par description naturelle via OpenAI' })
  async smartSearch(@Body('query') query: string) {
    const keywords = await this.openaiService.extractKeywords(query);
    const books = await this.booksService.searchByKeywords(keywords);
    return {
      success: true,
      query,
      keywords,
      data: books,
    };
  }
}