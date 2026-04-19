import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les auteurs' })
  @ApiResponse({ status: 200, description: 'Liste obtenue' })
  async findAll() {
    const data = await this.authorsService.findAll();
    return { success: true, data, message: 'Liste des auteurs' };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un auteur' })
  @ApiResponse({ status: 201, description: 'Auteur créé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 422, description: 'Validation échouée' })
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const data = await this.authorsService.create(createAuthorDto);
    return { success: true, data, message: 'Auteur créé avec succès' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un auteur + ses livres' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Détails obtenus' })
  @ApiResponse({ status: 404, description: 'Auteur non trouvé' })
  async findOne(@Param('id') id: string) {
    const data = await this.authorsService.findOne(id);
    return { success: true, data, message: 'Détails de l\'auteur' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un auteur' })
  @ApiResponse({ status: 200, description: 'Auteur modifié' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Auteur non trouvé' })
  async update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    const data = await this.authorsService.update(id, updateAuthorDto);
    return { success: true, data, message: 'Auteur modifié' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un auteur' })
  @ApiResponse({ status: 204, description: 'Auteur supprimé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Auteur non trouvé' })
  async remove(@Param('id') id: string) {
    await this.authorsService.remove(id);
  }
}