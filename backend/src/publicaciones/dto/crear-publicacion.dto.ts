import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsMongoId({ message: 'El usuario no es válido.' })
  usuarioId!: string;

  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(80, { message: 'El título no puede superar los 80 caracteres.' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(600, {
    message: 'La descripción no puede superar los 600 caracteres.',
  })
  descripcion!: string;
}
