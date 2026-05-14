import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProfissionalDto {
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsString()
  especialidade?: string;

  @IsOptional()
  @IsString()
  conselho?: string;

  @IsOptional()
  @IsString()
  numeroRegistro?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}