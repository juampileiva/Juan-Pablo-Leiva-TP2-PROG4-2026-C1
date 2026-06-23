import {
  BadRequestException,
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccionLikeDto } from './dto/accion-like.dto';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { EliminarPublicacionDto } from './dto/eliminar-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async crearPublicacion(
    @Body() crearPublicacionDto: CrearPublicacionDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    if (imagen && !imagen.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(
        'Solo se permiten imagenes JPG, JPEG, PNG o WEBP.',
      );
    }

    const imagenUrl = imagen
      ? await this.cloudinaryService.subirImagen(
          imagen,
          'red-social/publicaciones',
        )
      : '';

    return this.publicacionesService.crearPublicacion(
      crearPublicacionDto,
      imagenUrl,
    );
  }

  @Get()
  listarPublicaciones(@Query() filtros: ListarPublicacionesDto) {
    return this.publicacionesService.listarPublicaciones(filtros);
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
