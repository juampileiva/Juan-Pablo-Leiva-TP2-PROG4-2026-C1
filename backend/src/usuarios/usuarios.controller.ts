import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenService } from '../auth/token.service';
import { RegistroDto } from '../auth/dto/registro.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  listar(@Headers('authorization') authorization: string) {
    this.validarAdministrador(authorization);
    return this.usuariosService.listarUsuarios();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('fotoPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (req, file, callback) => {
          const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `perfil-${nombreUnico}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'), false);
        }
        callback(null, true);
      },
    }),
  )
  crear(
    @Headers('authorization') authorization: string,
    @Body() registroDto: RegistroDto,
    @UploadedFile() fotoPerfil?: Express.Multer.File,
  ) {
    this.validarAdministrador(authorization);
    const baseUrl = process.env.UPLOADS_URL || 'http://localhost:3000/uploads';
    const fotoPerfilUrl = fotoPerfil ? `${baseUrl}/perfiles/${fotoPerfil.filename}` : '';
    return this.usuariosService.crearUsuario({ ...registroDto, fotoPerfilUrl });
  }

  @Delete(':id')
  deshabilitar(@Headers('authorization') authorization: string, @Param('id') id: string) {
    this.validarAdministrador(authorization);
    return this.usuariosService.deshabilitarUsuario(id);
  }

  @Post(':id/habilitar')
  habilitar(@Headers('authorization') authorization: string, @Param('id') id: string) {
    this.validarAdministrador(authorization);
    return this.usuariosService.habilitarUsuario(id);
  }

  private validarAdministrador(authorization: string) {
    const token = this.tokenService.obtenerTokenDesdeHeader(authorization);
    const payload = this.tokenService.validarToken(token);

    if (payload.perfil !== 'administrador') {
      throw new ForbiddenException('Solo un administrador puede realizar esta acción.');
    }

    return payload;
  }
}
