import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

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
}