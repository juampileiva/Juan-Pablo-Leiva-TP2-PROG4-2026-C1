import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterAuthDto, imagePath: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, salt);

    const userData = {
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      correo: registerDto.correo,
      nombreUsuario: registerDto.nombreUsuario,
      contrasena: hashedPassword,
      fechaNacimiento: registerDto.fechaNacimiento,
      descripcionBreve: registerDto.descripcionBreve,
      imagenPerfil: imagePath,
      perfil: 'usuario',
      activo: true,
    };

    const newUser = await this.usersService.create(userData);

    const userObject = newUser.toObject();
    delete userObject.contrasena;
    
    return userObject;
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.usersService.findOneByIdentifier(loginDto.identificador);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.contrasena, user.contrasena);
    
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const userObject = user.toObject();
    delete userObject.contrasena;
    
    return userObject;
  }
}