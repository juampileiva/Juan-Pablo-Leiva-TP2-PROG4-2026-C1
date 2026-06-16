import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Guarda un nuevo usuario en la base de datos.
   * La contraseña ya debe venir encriptada desde el AuthService.
   */
  async create(userData: Partial<User>): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      // El código 11000 de MongoDB indica que se violó una restricción de campo único (unique)
      if (error.code === 11000) {
        throw new ConflictException('El correo o el nombre de usuario ya se encuentran registrados.');
      }
      throw new InternalServerErrorException('Error al intentar crear el usuario en la base de datos.');
    }
  }

  /**
   * Busca un usuario activo por su correo o nombre de usuario.
   */
  async findOneByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ correo: identifier }, { nombreUsuario: identifier }],
      activo: true,
    }).exec();
  }
}