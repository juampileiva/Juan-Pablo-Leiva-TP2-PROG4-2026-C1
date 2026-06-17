import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicacionesService {
  obtenerEstado() {
    return {
      mensaje: 'Módulo publicaciones creado correctamente.',
    };
  }
}
