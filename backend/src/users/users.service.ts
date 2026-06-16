import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

export interface CreateUserData {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  password: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  perfil?: UserRole;
  imagenPerfilUrl?: string | null;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(data: CreateUserData): Promise<UserDocument> {
    const correo = data.correo.toLowerCase().trim();
    const nombreUsuario = data.nombreUsuario.toLowerCase().trim();

    const existente = await this.userModel.findOne({
      $or: [{ correo }, { nombreUsuario }],
    });

    if (existente) {
      throw new BadRequestException('El correo o el nombre de usuario ya existe.');
    }

    const usuario = new this.userModel({
      ...data,
      correo,
      nombreUsuario,
      perfil: data.perfil ?? 'usuario',
      imagenPerfilUrl: data.imagenPerfilUrl ?? null,
    });

    return usuario.save();
  }

  async findByCorreoOrNombreUsuario(identificador: string): Promise<UserDocument | null> {
    const valor = identificador.toLowerCase().trim();

    return this.userModel.findOne({
      $or: [{ correo: valor }, { nombreUsuario: valor }],
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  toPublicUser(usuario: UserDocument) {
    const objeto = usuario.toObject() as any;

    return {
      id: objeto._id.toString(),
      nombre: objeto.nombre,
      apellido: objeto.apellido,
      correo: objeto.correo,
      nombreUsuario: objeto.nombreUsuario,
      fechaNacimiento: objeto.fechaNacimiento,
      descripcionBreve: objeto.descripcionBreve,
      perfil: objeto.perfil,
      imagenPerfilUrl: objeto.imagenPerfilUrl,
      activo: objeto.activo,
      createdAt: objeto.createdAt,
      updatedAt: objeto.updatedAt,
    };
  }
}