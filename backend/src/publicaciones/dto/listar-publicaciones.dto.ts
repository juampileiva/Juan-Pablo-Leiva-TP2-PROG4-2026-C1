import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListarPublicacionesDto {
  @IsOptional()
  @IsIn(['fecha', 'likes'], {
    message: 'El orden debe ser fecha o likes.',
  })
  orden?: 'fecha' | 'likes';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(0, { message: 'El offset no puede ser negativo.' })
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1, { message: 'El límite debe ser mayor a 0.' })
  @Max(20, { message: 'El límite máximo permitido es 20.' })
  limit?: number;

  @IsOptional()
  @IsMongoId({ message: 'El usuario no es válido.' })
  usuarioId?: string;

  @IsOptional()
  @IsString()
  usuarioActualId?: string;
}
