import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ComentariosController } from './comentarios/comentarios.controller';
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
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [PublicacionesController, ComentariosController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
