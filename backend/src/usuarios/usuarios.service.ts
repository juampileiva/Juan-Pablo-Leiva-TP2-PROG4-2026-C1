import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './usuario.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface UsuarioLimpio {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  fotoPerfilUrl: string;
  perfil: 'usuario' | 'administrador';
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CrearUsuarioParams {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  password: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  fotoPerfilUrl?: string;
  perfil?: 'usuario' | 'administrador';
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async crearUsuario(data: CrearUsuarioParams) {
    const existeCorreo = await this.usuarioModel.findOne({
      correo: data.correo.toLowerCase(),
    });

    if (existeCorreo) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    const existeNombreUsuario = await this.usuarioModel.findOne({
      nombreUsuario: data.nombreUsuario,
    });

    if (existeNombreUsuario) {
      throw new BadRequestException('El nombre de usuario ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const usuarioCreado = await this.usuarioModel.create({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo.toLowerCase(),
      nombreUsuario: data.nombreUsuario,
      passwordHash,
      fechaNacimiento: data.fechaNacimiento,
      descripcionBreve: data.descripcionBreve,
      fotoPerfilUrl: data.fotoPerfilUrl || '',
      perfil: data.perfil || 'usuario',
      activo: true,
    });

    return this.limpiarUsuario(usuarioCreado);
  }


  async buscarPorId(id: string) {
    const usuario = await this.usuarioModel.findById(id);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no válido.');
    }

    return this.limpiarUsuario(usuario);
  }

  async validarLogin(usuarioOCorreo: string, password: string) {
    const usuario = await this.usuarioModel.findOne({
      $or: [
        { correo: usuarioOCorreo.toLowerCase() },
        { nombreUsuario: usuarioOCorreo },
      ],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está deshabilitado.');
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValida) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    return this.limpiarUsuario(usuario);
  }

  limpiarUsuario(usuario: UsuarioDocument) {
    const obj: any = usuario.toObject();

    return {
      id: obj._id.toString(),
      nombre: obj.nombre,
      apellido: obj.apellido,
      correo: obj.correo,
      nombreUsuario: obj.nombreUsuario,
      fechaNacimiento: obj.fechaNacimiento,
      descripcionBreve: obj.descripcionBreve,
      fotoPerfilUrl: obj.fotoPerfilUrl,
      perfil: obj.perfil,
      activo: obj.activo,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
