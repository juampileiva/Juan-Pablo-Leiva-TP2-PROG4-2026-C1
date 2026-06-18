import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AccionLikeDto } from './dto/accion-like.dto';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { EliminarPublicacionDto } from './dto/eliminar-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/publicaciones',
        filename: (req, file, callback) => {
          const nombreUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `publicacion-${nombreUnico}${extension}`);
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
  crearPublicacion(
    @Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    const baseUrl = process.env.UPLOADS_URL || 'http://localhost:3000/uploads';
    const imagenUrl = imagen ? `${baseUrl}/publicaciones/${imagen.filename}` : '';

    return this.publicacionesService.crearPublicacion(
      crearPublicacionDto,
      imagenUrl,
    );
  }

  @Get()
  listarPublicaciones(@Query() filtros: ListarPublicacionesDto) {
    return this.publicacionesService.listarPublicaciones(filtros);
  }

  @Get(':id')
  obtenerPublicacion(
    @Param('id') id: string,
    @Query('usuarioActualId') usuarioActualId?: string,
  ) {
    return this.publicacionesService.obtenerPublicacion(id, usuarioActualId);
  }

  @Delete(':id')
  eliminarPublicacion(
    @Param('id') id: string,
    @Body() eliminarPublicacionDto: EliminarPublicacionDto,
  ) {
    return this.publicacionesService.eliminarPublicacion(
      id,
      eliminarPublicacionDto.usuarioId,
      eliminarPublicacionDto.perfil,
    );
  }

  @Post(':id/me-gusta')
  darMeGusta(@Param('id') id: string, @Body() accionLikeDto: AccionLikeDto) {
    return this.publicacionesService.darMeGusta(id, accionLikeDto.usuarioId);
  }

  @Delete(':id/me-gusta')
  quitarMeGusta(@Param('id') id: string, @Body() accionLikeDto: AccionLikeDto) {
    return this.publicacionesService.quitarMeGusta(id, accionLikeDto.usuarioId);
  }
}
