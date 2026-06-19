import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './usuario.schema';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TokenService } from '../auth/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, TokenService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
