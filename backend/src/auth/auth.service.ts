import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, imagenPerfilUrl: string | null) {
    const passwordEncriptada = await bcrypt.hash(dto.password, 10);

    const usuario = await this.usersService.create({
      ...dto,
      correo: dto.correo.toLowerCase().trim(),
      nombreUsuario: dto.nombreUsuario.toLowerCase().trim(),
      password: passwordEncriptada,
      imagenPerfilUrl,
      perfil: dto.perfil ?? 'usuario',
    });

    const usuarioPublico = this.usersService.toPublicUser(usuario);
    const token = await this.generarToken(usuarioPublico);

    return {
      message: 'Usuario registrado correctamente.',
      user: usuarioPublico,
      token,
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usersService.findByCorreoOrNombreUsuario(dto.identificador);

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario se encuentra deshabilitado.');
    }

    const passwordCorrecta = await bcrypt.compare(dto.password, usuario.password);

    if (!passwordCorrecta) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const usuarioPublico = this.usersService.toPublicUser(usuario);
    const token = await this.generarToken(usuarioPublico);

    return {
      message: 'Login correcto.',
      user: usuarioPublico,
      token,
    };
  }

  private async generarToken(usuario: any): Promise<string> {
    if (!usuario?.id || !usuario?.correo || !usuario?.nombreUsuario || !usuario?.perfil) {
      throw new BadRequestException('No se pudo generar el token del usuario.');
    }

    return this.jwtService.signAsync({
      sub: usuario.id,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    });
  }
}
