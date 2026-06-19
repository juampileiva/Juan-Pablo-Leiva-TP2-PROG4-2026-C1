import { Controller, Get, Headers, Query, ForbiddenException } from '@nestjs/common';
import { TokenService } from '../auth/token.service';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones/estadisticas')
export class EstadisticasController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
    @Headers('authorization') authorization: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    this.validarAdministrador(authorization);
    return this.publicacionesService.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios-por-lapso')
  comentariosPorLapso(
    @Headers('authorization') authorization: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    this.validarAdministrador(authorization);
    return this.publicacionesService.comentariosPorLapso(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
    @Headers('authorization') authorization: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    this.validarAdministrador(authorization);
    return this.publicacionesService.comentariosPorPublicacion(desde, hasta);
  }

  private validarAdministrador(authorization: string) {
    const token = this.tokenService.obtenerTokenDesdeHeader(authorization);
    const payload = this.tokenService.validarToken(token);

    if (payload.perfil !== 'administrador') {
      throw new ForbiddenException('Solo un administrador puede ver estadísticas.');
    }
  }
}
