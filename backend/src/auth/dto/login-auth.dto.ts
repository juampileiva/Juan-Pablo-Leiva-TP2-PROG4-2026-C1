import { IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: 'El identificador debe ser un texto.' })
  identificador!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  contrasena!: string;
}