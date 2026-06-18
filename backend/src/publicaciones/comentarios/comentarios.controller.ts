import { Body, Controller, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { TokenService } from '../../auth/token.service';
import { PublicacionesService } from '../publicaciones.service';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { EditarComentarioDto } from './dto/editar-comentario.dto';
import { ListarComentariosDto } from './dto/listar-comentarios.dto';

@Controller('publicaciones/:publicacionId/comentarios')
export class ComentariosController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly tokenService: TokenService,
  ) {}

  @Post()
  agregarComentario(
    @Param('publicacionId') publicacionId: string,
    @Body() crearComentarioDto: CrearComentarioDto,
    @Headers('authorization') authorization: string,
  ) {
    const payload = this.tokenService.validarToken(
      this.tokenService.obtenerTokenDesdeHeader(authorization),
    );

    return this.publicacionesService.agregarComentario(
      publicacionId,
      payload.sub,
      crearComentarioDto.mensaje,
    );
  }

  @Put(':comentarioId')
  editarComentario(
    @Param('publicacionId') publicacionId: string,
    @Param('comentarioId') comentarioId: string,
    @Body() editarComentarioDto: EditarComentarioDto,
    @Headers('authorization') authorization: string,
  ) {
    const payload = this.tokenService.validarToken(
      this.tokenService.obtenerTokenDesdeHeader(authorization),
    );

    return this.publicacionesService.editarComentario(
      publicacionId,
      comentarioId,
      payload.sub,
      editarComentarioDto.mensaje,
    );
  }

  @Get()
  listarComentarios(
    @Param('publicacionId') publicacionId: string,
    @Query() filtros: ListarComentariosDto,
    @Headers('authorization') authorization: string,
  ) {
    const payload = this.tokenService.validarToken(
      this.tokenService.obtenerTokenDesdeHeader(authorization),
    );

    return this.publicacionesService.listarComentarios(
      publicacionId,
      Number(filtros.offset ?? 0),
      Number(filtros.limit ?? 5),
      payload.sub,
    );
  }
}
