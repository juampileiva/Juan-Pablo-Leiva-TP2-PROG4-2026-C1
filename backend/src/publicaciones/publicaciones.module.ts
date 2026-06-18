import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthModule } from '../auth/auth.module';
import { Publicacion, PublicacionSchema } from './publicacion.schema';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { ComentariosController } from './comentarios/comentarios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    UsuariosModule,
    AuthModule,
  ],
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
