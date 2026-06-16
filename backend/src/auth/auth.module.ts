import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, // Importamos el módulo de usuarios para poder guardar/buscar
    JwtModule.register({
      global: true,
      secret: 'super_secreto_para_el_tp_prog4', // En producción esto va en variables de entorno (.env)
      signOptions: { expiresIn: '15m' }, // Vencimiento de 15 minutos según requisitos
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}