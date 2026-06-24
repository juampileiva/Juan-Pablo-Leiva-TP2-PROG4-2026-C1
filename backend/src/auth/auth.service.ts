import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly tokenService: TokenService,
  ) {}

  async registro(data: RegistroDto, fotoPerfilUrl: string) {
    if (data.password !== data.repetirPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const usuario = await this.usuariosService.crearUsuario({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      nombreUsuario: data.nombreUsuario,
      password: data.password,
      fechaNacimiento: data.fechaNacimiento,
      descripcionBreve: data.descripcionBreve,
      fotoPerfilUrl,
      perfil: data.perfil || 'usuario',
    });

    return {
      mensaje: 'Usuario registrado correctamente.',
      usuario,
      token: this.tokenService.generarToken(usuario),
    };
  }

  async login(data: LoginDto) {
    const usuario = await this.usuariosService.validarLogin(
      data.usuarioOCorreo,
      data.password,
    );

    return {
      mensaje: 'Login correcto.',
      usuario,
      token: this.tokenService.generarToken(usuario),
    };
  }

  async autorizar(token: string) {
    const payload = this.tokenService.validarToken(token);
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    return {
      mensaje: 'Token válido.',
      usuario,
    };
  }

  async refrescar(token: string) {
    const payload = this.tokenService.validarToken(token);
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    return {
      mensaje: 'Token renovado.',
      usuario,
      token: this.tokenService.generarToken(usuario),
    };
  }
}
