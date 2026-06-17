import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El usuario o correo es obligatorio.' })
  usuarioOCorreo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password!: string;
}
