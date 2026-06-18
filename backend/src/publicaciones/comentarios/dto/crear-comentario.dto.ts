import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearComentarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El comentario es obligatorio.' })
  @MinLength(2, { message: 'El comentario debe tener al menos 2 caracteres.' })
  @MaxLength(500, { message: 'El comentario no puede superar los 500 caracteres.' })
  mensaje!: string;
}
