import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('registro')
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, callback) => {
          const nombreUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `perfil-${nombreUnico}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async registro(
    @Body() registroDto: RegistroDto,
    @UploadedFile() fotoPerfil?: Express.Multer.File,
  ) {
    const baseUrl = process.env.UPLOADS_URL || 'http://localhost:3000/uploads';

    const fotoPerfilUrl = fotoPerfil
      ? `${baseUrl}/perfiles/${fotoPerfil.filename}`
      : '';

    return this.authService.registro(registroDto, fotoPerfilUrl);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('autorizar')
  async autorizar(@Headers('authorization') authorization: string, @Body('token') tokenBody?: string) {
    const token = this.tokenService.obtenerTokenDesdeHeader(authorization) || tokenBody || '';
    return this.authService.autorizar(token);
  }

  @Post('refrescar')
  async refrescar(@Headers('authorization') authorization: string, @Body('token') tokenBody?: string) {
    const token = this.tokenService.obtenerTokenDesdeHeader(authorization) || tokenBody || '';
    return this.authService.refrescar(token);
  }
}
