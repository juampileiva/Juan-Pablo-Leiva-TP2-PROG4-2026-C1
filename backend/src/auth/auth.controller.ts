import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async registro(
    @Body() registroDto: RegistroDto,
    @UploadedFile() fotoPerfil?: Express.Multer.File,
  ) {
    if (fotoPerfil && !fotoPerfil.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(
        'Solo se permiten imagenes JPG, JPEG, PNG o WEBP.',
      );
    }

    const fotoPerfilUrl = fotoPerfil
      ? await this.cloudinaryService.subirImagen(
          fotoPerfil,
          'red-social/perfiles',
        )
      : '';

    return this.authService.registro(registroDto, fotoPerfilUrl);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
