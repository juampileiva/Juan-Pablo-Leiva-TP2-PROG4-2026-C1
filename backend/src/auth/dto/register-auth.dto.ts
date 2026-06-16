import { 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  IsDateString, 
  IsOptional, 
  Matches 
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  @MinLength(2)
  apellido!: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo!: string;

  @IsString()
  @MinLength(4)
  nombreUsuario!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  contrasena!: string;

  @IsString()
  repetirContrasena!: string;

  @IsDateString()
  fechaNacimiento!: Date;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  descripcionBreve?: string;
}