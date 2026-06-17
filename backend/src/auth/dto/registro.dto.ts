import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistroDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  apellido!: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  correo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  nombreUsuario!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número.',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'La repetición de contraseña es obligatoria.' })
  repetirPassword!: string;

  @IsString()
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria.' })
  fechaNacimiento!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción breve es obligatoria.' })
  @MaxLength(250, {
    message: 'La descripción breve no puede superar los 250 caracteres.',
  })
  descripcionBreve!: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'])
  perfil?: 'usuario' | 'administrador';
}
