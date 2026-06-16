import { Controller, Get } from '@nestjs/common';

@Controller('publicaciones')
export class PublicationsController {
  @Get()
  findAll() {
    return {
      message: 'Módulo publicaciones creado para Sprint 1. La lógica completa se desarrolla en Sprint 2.',
      data: [],
    };
  }
}
