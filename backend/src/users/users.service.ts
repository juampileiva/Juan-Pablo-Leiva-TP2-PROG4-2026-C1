import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('El correo o el nombre de usuario ya se encuentran registrados.');
      }
      throw new InternalServerErrorException('Error al intentar crear el usuario en la base de datos.');
    }
  }

  async findOneByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ correo: identifier }, { nombreUsuario: identifier }],
      activo: true,
    }).exec();
  }
}