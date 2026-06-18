import { IsIn, IsMongoId, IsOptional } from 'class-validator';

export class EliminarPublicacionDto {
  @IsMongoId({ message: 'El usuario no es válido.' })
  usuarioId!: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'])
  perfil?: 'usuario' | 'administrador';
}
