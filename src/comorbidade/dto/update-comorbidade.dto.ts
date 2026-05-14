import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateComorbidadeDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  cid?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}