import { IsMongoId } from 'class-validator';

export class AccionLikeDto {
  @IsMongoId({ message: 'El usuario no es válido.' })
  usuarioId!: string;
}
