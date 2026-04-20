import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
  @ApiProperty({ example: 'admin', description: "Nom d'utilisateur" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentification et obtention du token JWT' })
  @ApiResponse({ status: 200, description: 'Login réussi' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() loginDto: LoginDto) {
    const { token, user } = await this.authService.login(loginDto.username, loginDto.password);
    return { success: true, data: { token, user }, message: 'Authentification réussie' };
  }
}