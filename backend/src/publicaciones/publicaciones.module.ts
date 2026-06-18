import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Publicacion, PublicacionSchema } from './publicacion.schema';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: PublicacionSchema,
      },
    ]),
    UsuariosModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
