import { Controller, Get } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Get()
  obtenerEstado() {
    return this.publicacionesService.obtenerEstado();
  }
}
