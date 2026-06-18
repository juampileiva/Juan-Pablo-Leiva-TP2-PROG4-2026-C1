import { IsOptional, IsString } from 'class-validator';

export class ListarComentariosDto {
  @IsOptional()
  @IsString()
  offset?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
