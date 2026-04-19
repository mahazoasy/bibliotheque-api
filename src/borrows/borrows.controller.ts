import { Controller, Get, Post, Body, Param, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Borrows')
@Controller('borrows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les emprunts en cours' })
  @ApiResponse({ status: 200, description: 'Liste obtenue' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async findAllActive() {
    const data = await this.borrowsService.findAllActive();
    return { success: true, data, message: 'Emprunts en cours' };
  }

  @Post()
  @ApiOperation({ summary: 'Enregistrer un emprunt' })
  @ApiResponse({ status: 201, description: 'Emprunt créé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 422, description: 'Validation échouée' })
  async create(@Body() createBorrowDto: CreateBorrowDto) {
    const data = await this.borrowsService.create(createBorrowDto);
    return { success: true, data, message: 'Emprunt enregistré' };
  }

  @Patch(':id/return')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer un livre comme rendu' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Retour effectué' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Emprunt non trouvé' })
  async returnBook(@Param('id') id: string) {
    const data = await this.borrowsService.returnBook(id);
    return { success: true, data, message: 'Livre retourné' };
  }
}